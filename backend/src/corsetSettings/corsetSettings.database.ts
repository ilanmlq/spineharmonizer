import { prisma } from "../plugins/prisma.js";
import { CreateCorsetSettingsDto } from "./corsetSettings.validator.js";

export function createCorsetSettings(
  corsetSettingsData: CreateCorsetSettingsDto,
) {
  return prisma.corsetSetting.create({
    data: {
      corsetId: corsetSettingsData.corsetId,
      subAuxiliary: corsetSettingsData.subAuxiliary.subAuxiliary,
      lumbar: corsetSettingsData.lumbar.lumbar,
      thoracic: corsetSettingsData.thoracic.thoracic,
      trochanter: corsetSettingsData.trochanter.trochanter,
    },
  });
}

export function getCorsetSettingsByCorsetId(corsetId: number) {
  return prisma.corsetSetting.findFirst({
    where: { corsetId },
    orderBy: { timestamp: "desc" },
  });
}
