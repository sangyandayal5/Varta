'use client';

import clsx from "clsx";
import{
    FieldErrors,
    FieldValues,
    UseFormRegister
} from  'react-hook-form'

interface InputProps {
    label: string;
    id: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>,
    errors: FieldErrors,
    disabled?: boolean;
}


const Input:React.FC<InputProps> = ({
    label,
    id,
    type,
    required,
    register,
    errors,
    disabled
}) => {
  return (
    <div>
        <label 
            className="
                block
                text-sm
                font-medium
                leading-6
                text-grey-900
                " 
            htmlFor={id}
        >
            {label}
        </label>
        <div className="mt-2">
            <input
                id={id}
                type={type}
                autoComplete={id}
                disabled={disabled}
                {...register(id, {required})}
                className={clsx(`
                        form-input
                        block
                        w-full
                        rounded-md
                        border-0
                        py-1.5
                        px-1.5
                        text-grey-900
                        shadow-sm
                        ring-1
                        ring-insert
                        ring-grey-300
                        placeholder:text-grey-300
                        focus:ring-2
                        sm:text-sm
                        sm:leading-6`,
                        errors[id] && "focus:ring-rose-500",
                        disabled && "opacity-50 cursor-dafault"
                    )}
            />
        </div>



    </div>
  )
}

export default Input