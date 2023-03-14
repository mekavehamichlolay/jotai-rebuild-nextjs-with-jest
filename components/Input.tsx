import { useAtom } from "../jotai";
import { salary as salaryAtom, bonus as bonusAtom } from "../store/global";

function Input() {
  const [salary, setSalary] = useAtom(salaryAtom);
  const [bonus, setBonus] = useAtom(bonusAtom);
  return (
    <>
      <div>
        <label htmlFor="salary">
          <input
            value={salary}
            onChange={(e) => setSalary(+e.target.value)}
            type="text"
            id="salary"
          />
        </label>
      </div>
      <div>
        <label htmlFor="bonus">
          <input
            value={bonus}
            onChange={(e) => setBonus(+e.target.value)}
            type="text"
            id="bonuss"
          />
        </label>
      </div>
    </>
  );
}

export default Input;
