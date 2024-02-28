import { useState } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const Field = ({
  name,
  label,
  placeHolder = '',
  note = '',
  type = 'text',
  id,
  value,
  onChange,
  required,
  isDisabled,
  maxLength,
  minLength,
  maxDate,
  showOptional = false,
  labelClassNames = '',
  inputClassNames = '',
  lableAddOn = '',
  leftAddOn = '',
  rightAddOn = '',
  counterField,
  onIncrease,
  onDecrease,
  onKeyUp,
  tooltip,
  autoComplete = 'on',
  readOnly = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`mb-2 flex items-center gap-2 text-sm font-medium text-gray-600 ${labelClassNames}`}>
          {label}
          {showOptional && <span className="pl-1 text-[10px] text-gray-400">{'(Optional)'}</span>}
          {Boolean(lableAddOn) && lableAddOn}
          {tooltip && (
            <Tooltip title={tooltip} className='cursor-pointer'>
              <QuestionCircleOutlined />
            </Tooltip>
          )}
        </label>
      )}
      <div className="flex">
        {leftAddOn && (
          <button
            className="z-1 inline-flex flex-shrink-0 items-center rounded-s-md border border-r-0 border-gray-300 bg-[#f3f7fe] px-2.5 py-1.5 text-center text-sm font-medium text-gray-400"
            type="button" disabled>
            {leftAddOn}
          </button>
        )}
        {counterField && onDecrease && (
          <button
            type="button"
            className="rounded-s-lg border border-gray-300 bg-[#f3f7fe] px-2 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
            disabled={value < 1}
            onClick={onDecrease}>
            -
          </button>
        )}
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          name={name || id}
          id={id}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          onKeyUp={onKeyUp}
          className={`block min-h-[42px] w-full rounded-md border focus:ring-0 focus:outline-none focus:border-gray-300 
          ${leftAddOn && 'rounded-l-none rounded-r-md'} ${rightAddOn && 'rounded-l-md rounded-r-none'} ${counterField && 'rounded-none text-center'
            } border-gray-300 px-2.5 text-sm text-gray-900 disabled:bg-neutral-300 ${inputClassNames} ${type === 'number'
              ? '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
              : ''
            } ${type === 'password' && 'border-r-0 rounded-r-none'}`}
          placeholder={placeHolder}
          required={required}
          max={maxDate || ''}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={autoComplete}
          readOnly={readOnly}
        />
        {type === 'password' && (
          <button
            type="button"
            className="rounded-e-lg border border-gray-300 border-l-0 w-[40px] focus:outline-none focus:ring-0"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </button>
        )}
        {counterField && onIncrease && (
          <button
            type="button"
            className="rounded-e-lg border border-gray-300 bg-[#f3f7fe] px-2 hover:bg-gray-200 focus:outline-none focus:ring-0 "
            onClick={onIncrease}>
            +
          </button>
        )}
        {rightAddOn && (
          <button
            className="z-1 inline-flex flex-shrink-0 items-center rounded-e-md border border-l-0 border-gray-300 bg-[#f3f7fe] px-2.5 py-1.5 text-center text-sm font-medium text-gray-400"
            type="button" disabled>
            {rightAddOn}
          </button>
        )}
      </div>
      {note && <p className="mt-1 whitespace-pre-wrap text-[10px] leading-4 text-gray-400">{note}</p>}
    </div>
  );
};

export default Field;
