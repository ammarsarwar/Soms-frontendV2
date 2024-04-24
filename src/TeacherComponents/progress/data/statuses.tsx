import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
interface StatusRadioButtonsProps {
  idPrefix: string;
}

export const StatusRadioButtons: React.FC<StatusRadioButtonsProps> = ({
  idPrefix,
}) => {
  return (
    <RadioGroup>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="good"
          id={`${idPrefix}-good`}
          className="text-green-500"
        />
        <Label htmlFor={`${idPrefix}-good`} className="text-green-500">
          Excellent
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="excellence"
          id={`${idPrefix}-excellence`}
          className="text-yellow-500"
        />
        <Label htmlFor={`${idPrefix}-excellence`} className="text-yellow-500">
          Good
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="bad"
          id={`${idPrefix}-bad`}
          className="text-blue-500"
        />
        <Label htmlFor={`${idPrefix}-bad`} className="text-blue-500">
          Bad
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <RadioGroupItem
          value="concern"
          id={`${idPrefix}-concern`}
          className="text-red-500"
        />
        <Label htmlFor={`${idPrefix}-concern`} className="text-red-500">
          Calls for Concern
        </Label>
      </div>
    </RadioGroup>
  );
};
