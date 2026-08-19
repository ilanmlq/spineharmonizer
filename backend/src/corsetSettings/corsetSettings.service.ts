import { NotFoundError } from "../utils/errors.js";
import * as db from "./corsetSettings.database.js";
import { CreateCorsetSettingsDto } from "./corsetSettings.validator.js";
import { getCorsetById } from "../corset/corset.service.js";

export async function createCorsetSettings(data: CreateCorsetSettingsDto) {
    await getCorsetById(data.corsetId);
    return db.createCorsetSettings(data);
}

export async function getCorsetSettingsByCorsetId(corsetId: number) {
    return db.getCorsetSettingsByCorsetId(corsetId);
}
