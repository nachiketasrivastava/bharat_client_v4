import React, { useEffect } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activeCompanyAtom, flashAtom } from "../../../store";

const CompanyBoundNavbar = () => {
  const [activeCompany, setActiveCompany] = useRecoilState(activeCompanyAtom);
  const setFlash = useSetRecoilState(flashAtom);
  useEffect(() => {
    setActiveCompany(0);
  }, []);
  const handleLeftClick = () => {
    if (activeCompany === 0) {
      setActiveCompany(5);
    } else {
      setActiveCompany(activeCompany - 1);
    }
    setFlash(true);
  };
  const handleRightClick = () => {
    if (activeCompany === 5) {
      setActiveCompany(0);
    } else {
      setActiveCompany(activeCompany + 1);
    }
    setFlash(true);
  };
  const navbarItems = [
    "All Channels",
    "Customer Webinar",
    "Linkedin",
    "Referral",
    "Webinar",
    "Website",
  ];

  return (
    <div className="px-14 pt-6 flex justify-between items-center w-4/5 text-[13px] gap-4">
      <LeftOutlined className="text-[10px]" onClick={handleLeftClick} />
      {navbarItems.map((item, index) => (
        <div
          key={index}
          className={`border border-t-0 border-l-0 border-r-0 w-[20%] flex justify-center cursor-pointer duration-300 ease-in-out hover:border-[#E07E65] ${
            activeCompany === index && "border-[#E07E65] text-[#E07E65]"
          }`}
          onClick={() => {
            setActiveCompany(index);
            setFlash(true);
          }}
        >
          {item}
        </div>
      ))}
      <RightOutlined className="text-[10px]" onClick={handleRightClick} />
    </div>
  );
};

export default CompanyBoundNavbar;
