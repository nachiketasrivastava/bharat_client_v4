import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { activeCreateTabAtom } from "../../store/atoms/ProjectsAtoms";

import DataSource from "../DataSource/DataSource";
import Data from "../Data/Data";

const CreateProject = () => {
  const [activeCreateTab, setActiveCreateTab] =
    useRecoilState(activeCreateTabAtom);

  useEffect(() => {
    setActiveCreateTab(0);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center pr-4 pt-2">
        <div
          className="flex justify-center items-center border rounded-l-md bg-[#E07E65] text-white px-2 py-1 text-sm cursor-pointer flex-1"
          onClick={() => setActiveCreateTab(0)}
        >
          Data Source
        </div>
        <div
          className={`${
            activeCreateTab >= 1
              ? "text-white bg-[#E07E65]"
              : "bg-gray-300 font-semibold"
          } flex justify-center items-center border px-2 py-1 text-sm cursor-pointer flex-1`}
          onClick={() => setActiveCreateTab(1)}
        >
          Data
        </div>
        <div
          className={`${
            activeCreateTab == 2
              ? "text-white bg-[#E07E65]"
              : "bg-gray-300 font-semibold"
          } flex justify-center items-center border rounded-r-md px-2 py-1 text-sm cursor-pointer flex-1`}
          onClick={() => setActiveCreateTab(2)}
        >
          Dashboard
        </div>
      </div>
      <div className="h-[80vh] w-full">
        {activeCreateTab === 0 ? (
          <DataSource />
        ) : activeCreateTab === 1 ? (
          <Data />
        ) : (
          "Dashboard"
        )}
      </div>
    </div>
  );
};

export default CreateProject;
