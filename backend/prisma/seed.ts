import { PrismaClient, State } from "../src/generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const PASS_HASH = "$2b$10$bSNJEjWz20Q4V0i0A4HziOw.ej486jWoaw7Vdk6rfu5JbWlTWDv/G"; // "password"

async function main() {
  console.log("⏳ Nettoyage complet de la base de données...");
  await prisma.exerciseRealization.deleteMany();
  await prisma.programOnExercise.deleteMany();
  await prisma.program.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.corsetEvent.deleteMany();
  await prisma.corsetSetting.deleteMany();
  await prisma.corset.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.user.deleteMany();

  // ==========================================
  // 1. BANQUE D'EXERCICES DISPONIBLES
  // ==========================================
  console.log("🏋️‍♂️ Création de la bibliothèque d'exercices...");
  const exercisesData = [
    { name: "Traction Latérale", desc: "Exercice de traction latérale du tronc pour étirer la colonne vertébrale.", url: "https://www.youtube.com/embed/ofcnTY-Ymss" },
    { name: "La Chaise", desc: "Exercice de posture assise contre un mur pour aligner la colonne.", url: "https://www.youtube.com/embed/O1l1DBqYUfc" },
    { name: "Gainage Ventral", desc: "Maintien en planche pour renforcer la sangle abdominale profonde.", url: "https://www.youtube.com/embed/demo1" },
    { name: "Extension Dorsale", desc: "Renforcement des muscles érecteurs du rachis.", url: "https://www.youtube.com/embed/demo2" },
    { name: "Étirement Chat-Chameau", desc: "Mobilisation douce de la colonne en flexion-extension.", url: "https://www.youtube.com/embed/demo3" }
  ];

  const exercises = await Promise.all(
    exercisesData.map(exo => prisma.exercise.create({
      data: { name: exo.name, description: exo.desc, image: "image.png", url: exo.url }
    }))
  );

  // ==========================================
  // 2. CRÉATION DES MÉDECINS (3 DOCTORS)
  // ==========================================
  console.log("🩺 Création des professionnels de santé...");
  const doctors = [];
  const doctorNames = ["smith", "garcia", "rousseau"];
  
  for (const name of doctorNames) {
    const doc = await prisma.user.create({
      data: {
        email: `dr.${name}@hug.ch`,
        username: `dr${name}`,
        passwordHash: PASS_HASH,
        password: PASS_HASH,
        role: "DOCTOR",
      },
    });
    doctors.push(doc);
  }

  // ==========================================
  // 3. CONFIGURATION DES FAMILLES (4 PARENTS -> 15 ENFANTS)
  // ==========================================
  console.log("👨‍👩‍👧‍👦 Structure des familles et des patients...");
  
  const families = [
    { parent: "dupont", children: ["lucas", "emma", "chloe", "theo"] }, // 4 enfants
    { parent: "martin", children: ["leo", "manon", "hugo", "jade"] },   // 4 enfants
    { parent: "bernard", children: ["thomas", "zoe", "louis"] },       // 3 enfants
    { parent: "dubois", children: ["arthur", "lina", "alice", "paul"] } // 4 enfants
  ];

  let docIndex = 0;
  let totalPatients = 0;

  for (const fam of families) {
    // Création du parent unique de la fratrie
    const parentUser = await prisma.user.create({
      data: {
        email: `parent.${fam.parent}@email.com`,
        username: `parent_${fam.parent}`,
        passwordHash: PASS_HASH,
        password: PASS_HASH,
        role: "PARENT",
      }
    });

    // Pour chaque enfant (Patient) de ce parent
    for (const child of fam.children) {
      // Attribution d'un médecin tournant de manière équitable
      const assignedDoctor = doctors[docIndex % doctors.length];
      docIndex++;
      totalPatients++;

      const patientUser = await prisma.user.create({
        data: {
          email: `${child}.${fam.parent}@email.com`,
          username: `${child}_${fam.parent}`,
          passwordHash: PASS_HASH,
          password: PASS_HASH,
          role: "PATIENT",
          parentsId: parentUser.id,
          doctorId: assignedDoctor.id,
        }
      });

      // ==========================================
      // 4. CONFIGURATION UNIQUE DU CORSET
      // ==========================================
      const corset = await prisma.corset.create({
        data: { patientId: patientUser.id }
      });

      // Configuration des cibles de pression personnalisées par patient
      await prisma.corsetSetting.create({
        data: {
          corsetId: corset.id,
          subAuxiliary: 35 + (totalPatients % 10),
          thoracic: 50 + (totalPatients % 10),
          lumbar: 55 + (totalPatients % 10),
          trochanter: 25 + (totalPatients % 10),
        }
      });

      // Historique des événements capteurs (Dernières 6 heures, un point par heure)
      const corsetEvents = [];
      for (let h = 1; h <= 6; h++) {
        const isWorn = h !== 4; // Simuler une pause où le corset est retiré à H-4
        corsetEvents.push({
          corsetId: corset.id,
          battery: 100 - (h * 3),
          state: isWorn ? State.WORN : State.NOT_WORN, // Correction stricte du typage Enum
          subAuxiliary: isWorn ? 38 : 0,
          thoracic: isWorn ? 53 : 0,
          lumbar: isWorn ? 58 : 0,
          trochanter: isWorn ? 28 : 0,
          timestamp: new Date(Date.now() - h * 3600000),
        });
      }
      await prisma.corsetEvent.createMany({ data: corsetEvents });

      // ==========================================
      // 5. PRESCRIPTION & PROGRAMME MÉDICAL
      // ==========================================
      const prescription = await prisma.prescription.create({
        data: {
          duration: 12 + (totalPatients % 12), // Entre 12 et 24 mois
          patientId: patientUser.id,
          doctorId: assignedDoctor.id,
        }
      });

      const program = await prisma.program.create({
        data: {
          name: `Programme thérapeutique - ${child.toUpperCase()}`,
          description: "Série d'exercices quotidiens prescrits pour corriger la posture.",
          startDate: new Date(),
          endDate: new Date(Date.now() + 14 * 24 * 3600000), // Valable 14 jours
          patientId: patientUser.id,
          doctorId: assignedDoctor.id,
          prescriptionId: prescription.id,
        }
      });

      // Assigner 2 exercices fixes de la liste au programme du patient
      const assignedExo1 = exercises[totalPatients % exercises.length];
      const assignedExo2 = exercises[(totalPatients + 1) % exercises.length];

      const progOnExo1 = await prisma.programOnExercise.create({
        data: { programId: program.id, exerciseId: assignedExo1.id, sets: 3, repetitions: 15, time: 10 }
      });

      const progOnExo2 = await prisma.programOnExercise.create({
        data: { programId: program.id, exerciseId: assignedExo2.id, sets: 4, repetitions: 12, time: 15 }
      });

      // ==========================================
      // 6. HISTORIQUE DE COMPLÉTION (REALIZATIONS)
      // ==========================================
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await prisma.exerciseRealization.createMany({
        data: [
          // Sessions validées hier
          {
            startedAt: new Date(yesterday.setHours(10, 0)),
            finishedAt: new Date(yesterday.setHours(10, 12)),
            repsDone: 15,
            done: true,
            programOnExerciseId: progOnExo1.id,
          },
          {
            startedAt: new Date(yesterday.setHours(15, 30)),
            finishedAt: new Date(yesterday.setHours(15, 45)),
            repsDone: 12,
            done: true,
            programOnExerciseId: progOnExo2.id,
          },
          // Sessions en cours ou ratées aujourd'hui
          {
            startedAt: new Date(today.setHours(9, 15)),
            finishedAt: new Date(today.setHours(9, 25)),
            repsDone: 8,
            done: false,
            programOnExerciseId: progOnExo1.id,
          }
        ]
      });
    }
  }

  const finalUserCount = await prisma.user.count();
  console.log(`---`);
  console.log(`🚀 SEEDING REUSSI AVEC SUCCÈS !`);
  console.log(`👥 Total Utilisateurs en base : ${finalUserCount}`);
  console.log(`   ├ 🩺 Médecins : ${doctors.length}`);
  console.log(`   ├ 👨‍👩‍👧‍👦 Parents : ${families.length}`);
  console.log(`   └ 🧒 Patients (Enfants) : ${totalPatients}`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur critique lors du seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });