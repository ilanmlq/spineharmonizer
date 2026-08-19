import { prisma } from "../plugins/prisma.js";
import { CreateCorsetEventDto } from "./corsetEvent.validator.js";

export function createCorsetEvent(corsetEventData: CreateCorsetEventDto) {
  return prisma.corsetEvent.create({
    data: {
      corsetId: corsetEventData.corsetId,
      battery: corsetEventData.battery,
      state: corsetEventData.state,
      subAuxiliary: corsetEventData.subAuxiliary,
      lumbar: corsetEventData.lumbar,
      thoracic: corsetEventData.thoracic,
      trochanter: corsetEventData.trochanter,
      timestamp: corsetEventData.timestamp,
    },
  });
}

export function getCorsetEventsByCorsetId(corsetId: number) {
  return prisma.corsetEvent.findMany({
    where: { corsetId },
    orderBy: { timestamp: "desc" },
  });
}
