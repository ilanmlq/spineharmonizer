import { NotFoundError } from "../utils/errors.js";
import * as db from "./corsetEvent.database.js";
import { CreateCorsetEventDto } from "./corsetEvent.validator.js";
import { getCorsetById } from "../corset/corset.service.js";

export async function createCorsetEvent(data: CreateCorsetEventDto) {
    await getCorsetById(data.corsetId);
    return db.createCorsetEvent(data);
}

export async function getCorsetEventsByCorsetId(corsetId: number) {
    return db.getCorsetEventsByCorsetId(corsetId);
}
