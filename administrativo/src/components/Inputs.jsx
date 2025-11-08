function Inputs({ type, placeholder, value, onChange, required }) {
  return (
    <input
      className='input'
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

export default Inputs;