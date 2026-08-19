import { prisma } from "../plugins/prisma.js";
import { CreateCorsetDto } from "./corset.validator.js";

export async function createCorset(corsetData: CreateCorsetDto) {
  const corset = await prisma.corset.create({
    data: {
      patientId: corsetData.patientId,
    },
  });

  return corset;
}

export function getAllCorsets() {
  return prisma.corset.findMany();
}

export function getCorsetById(id: number) {
  return prisma.corset.findUnique({
    where: { id },
  });
}

export function updateCorset(id: number, corsetData: Partial<CreateCorsetDto>) {
  return prisma.corset.update({
    where: { id },
    data: corsetData,
  });
}

export function getBatteryByCorsetId(id: number) {
  return prisma.corsetEvent.findFirst({
    where: { corsetId: id },
    orderBy: { timestamp: "desc" },
    select: { battery: true },
  });
}

export function getLatestCorsetEventByCorsetId(id: number) {
  return prisma.corsetEvent.findFirst({
    where: { corsetId: id },
    orderBy: { timestamp: "desc" },
  });
}

export async function getCorsetDailyWornTime(id: number, date: string) {
  const now = new Date();

  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const theoreticalEndOfDay = new Date(`${date}T23:59:59.999Z`);

  const endOfDay = theoreticalEndOfDay > now ? now : theoreticalEndOfDay;

  if (startOfDay > now) {
    throw new Error("La date ne peut pas être dans le futur");
  }

  const lastEventBeforeDay = await prisma.corsetEvent.findFirst({
    where: {
      corsetId: id,
      timestamp: { lt: startOfDay },
    },
    orderBy: { timestamp: "desc" },
  });

  const eventsDuringDay = await prisma.corsetEvent.findMany({
    where: {
      corsetId: id,
      timestamp: { gte: startOfDay, lte: endOfDay },
    },
    orderBy: { timestamp: "asc" },
  });

  let totalWornMs = 0;
  let currentState = lastEventBeforeDay?.state || "NOT_WORN";
  let lastTimestamp = currentState === "WORN" ? startOfDay.getTime() : null;

  for (const event of eventsDuringDay) {
    if (event.state === "WORN") {
      if (currentState === "NOT_WORN") {
        currentState = "WORN";
        lastTimestamp = event.timestamp.getTime();
      }
    } else if (event.state === "NOT_WORN") {
      if (currentState === "WORN") {
        if (lastTimestamp) {
          totalWornMs += event.timestamp.getTime() - lastTimestamp;
        }
        currentState = "NOT_WORN";
        lastTimestamp = null;
      }
    }
  }

  if (currentState === "WORN" && lastTimestamp) {
    totalWornMs += endOfDay.getTime() - lastTimestamp;
  }

  return Math.round(totalWornMs / 60000);
}

export async function getCorsetWornTimeInRange(
  id: number,
  startDate: string,
  endDate: string,
) {
  const now = new Date();

  const startOfRange = new Date(`${startDate}T00:00:00.000Z`);
  const theoreticalEndOfRange = new Date(`${endDate}T23:59:59.999Z`);

  const endOfRange = theoreticalEndOfRange > now ? now : theoreticalEndOfRange;

  if (startOfRange > now) {
    throw new Error("La date de début ne peut pas être dans le futur");
  }
  if (startOfRange > theoreticalEndOfRange) {
    throw new Error(
      "La date de début doit être antérieure ou égale à la date de fin",
    );
  }

  const lastEventBeforeRange = await prisma.corsetEvent.findFirst({
    where: {
      corsetId: id,
      timestamp: { lt: startOfRange },
    },
    orderBy: { timestamp: "desc" },
  });

  const eventsDuringRange = await prisma.corsetEvent.findMany({
    where: {
      corsetId: id,
      timestamp: { gte: startOfRange, lte: endOfRange },
    },
    orderBy: { timestamp: "asc" },
  });

  let totalWornMs = 0;
  let currentState = lastEventBeforeRange?.state || "NOT_WORN";

  let lastTimestamp = currentState === "WORN" ? startOfRange.getTime() : null;

  for (const event of eventsDuringRange) {
    if (event.state === "WORN") {
      if (currentState === "NOT_WORN") {
        currentState = "WORN";
        lastTimestamp = event.timestamp.getTime();
      }
    } else if (event.state === "NOT_WORN") {
      if (currentState === "WORN") {
        if (lastTimestamp) {
          totalWornMs += event.timestamp.getTime() - lastTimestamp;
        }
        currentState = "NOT_WORN";
        lastTimestamp = null;
      }
    }
  }

  if (currentState === "WORN" && lastTimestamp) {
    totalWornMs += endOfRange.getTime() - lastTimestamp;
  }

  console.log({
    heureServeurUTC: now.toISOString(),
    startOfRange: startOfRange.toISOString(),
    minutesCalculees: Math.round(totalWornMs / 60000),
    nombreEvenementsTrouves: eventsDuringRange.length,
  });
  return Math.round(totalWornMs / 60000);
}
