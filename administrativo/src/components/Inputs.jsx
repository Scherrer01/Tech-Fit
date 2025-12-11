function Inputs({
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  className = "",
  defaultValue,
  ...rest
}) {
  // Monta props do input de forma a não passar `value` undefined
  // mescla styles passados via rest.style com os styles que garantem foco
  const { style: restStyle, ...restWithoutStyle } = rest;
  const inputStyle = {
    position: "relative",
    zIndex: 50,
    pointerEvents: "auto",
    ...restStyle,
  };

  const inputProps = {
    className: (`input ` + className).trim(),
    type,
    placeholder,
    required,
    style: inputStyle,
    ...restWithoutStyle,
  };

  if (value !== undefined) {
    // Comportamento controlled
    inputProps.value = value;
    inputProps.onChange = onChange;
  } else if (defaultValue !== undefined) {
    // Comportamento uncontrolled com defaultValue
    inputProps.defaultValue = defaultValue;
  }

  return <input {...inputProps} />;
}

export default Inputs;
