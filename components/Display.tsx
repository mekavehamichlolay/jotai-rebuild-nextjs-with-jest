import { useAtomValue } from "../jotai";
import {
  salary as salaryAtom,
  bonus as bonusAtom,
  fullSalary,
} from "../store/global";

function Display() {
  const salary = useAtomValue(salaryAtom);
  const bonus = useAtomValue(bonusAtom);
  const total = useAtomValue(fullSalary);
  return (
    <div>
      <div>base salary: {salary}</div>
      <div>bonus: {bonus}</div>
      <div>total: {total}</div>
    </div>
  );
}

export default Display;
