function Button({ children, type = "button", disabled = false, variant, ...rest }) {
  const baseClasses =
    "cursor-pointer transition-all text-white px-6 py-2 rounded-lg border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]";

  const variants = {
    update: "bg-blue-500 border-blue-600",
    create: "bg-green-500 border-green-600",
    delete: "bg-red-500 border-red-600",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]}`}
      {...rest}   // agora o onClick e outras props extras são repassados corretamente
    >
      {children}
    </button>
  );
}

export default Button;
