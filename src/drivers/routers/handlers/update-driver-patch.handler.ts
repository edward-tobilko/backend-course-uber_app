import { Request, Response } from 'express';

import { HTTP_STATUS_CODES } from '../../../core/utils/http-statuses';
import { normalizeDriverName } from '../../../core/utils/driver-name.normalize';
import { driversRepository } from '../../repositories/drivers.repository';

export function updateDriverPatchHandler(
  req: Request<{ id: string }, {}, { name: string }>,
  res: Response,
) {
  const id = +req.params.id;

  // * знаходимо обʼєкт (водія), який ми будемо оновляти
  const driver = driversRepository.findDriverById(id);

  // * перевіряємо, якщо обʼєкт не знайдено
  if (!driver)
    return res
      .status(HTTP_STATUS_CODES.NOT_FOUND_404)
      .json({ message: `Driver with id=${id} not found` });

  // * отримуємо нову строку з валідацією
  let normalized: string;
  try {
    normalized = normalizeDriverName(req.body.name);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid name';
    return res.status(400).json({ message: msg });
  }

  // * оновлюємо лише те, що передали
  const updatedRow = driversRepository.updatePatch(id, { name: normalized });

  res.status(HTTP_STATUS_CODES.OK_200).json({
    message: `Driver id=${id} updated successfully`,
    updatedDriverName: updatedRow,
  });
}

// ? Пояснення для Request<>:
// * Request<{req.params - те що передаємо в URL}, {res.body - те що відправляємо з body}, {req.body - те що передаємо в body}, {req.query - те що передаємо в URL (?page=2&limit=10)}
