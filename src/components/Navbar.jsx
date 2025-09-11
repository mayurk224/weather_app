import React from "react";
import UnitsCombobox from "./UnitsCombobox";

const Navbar = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="logo">
          <img src="src/assets/logo.svg" alt="" className="h-9 lg:h-10 " />
        </div>
        <div className="">
          <UnitsCombobox />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
