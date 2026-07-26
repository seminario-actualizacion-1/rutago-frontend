import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({
  name,
  id,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="input-group" style={{ position: "relative" }}>
      {id && (
        <label htmlFor={id} style={{ display: "none" }}>
          {placeholder}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        style={{ width: "100%", paddingRight: "40px", boxSizing: "border-box" }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        tabIndex={-1}
        style={{
          position: "absolute",
          right: "8px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#888",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
          zIndex: 1,
        }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
