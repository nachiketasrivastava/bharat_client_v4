import React from "react";
import { useSetRecoilState } from "recoil";

import { PlusOutlined } from "@ant-design/icons";
import { initialPageAtom } from "../../store/atoms/ProjectsAtoms";

const ProjectsDashboard = () => {
  const setInitialPage = useSetRecoilState(initialPageAtom);

  return (
    <div className="flex justify-center items-center h-[85vh]">
      <div
        className="flex justify-center items-center gap-2 text-lg p-2 rounded-md border border-[#E07E65] text-[#E07E65] cursor-pointer hover:scale-110 duration-300 ease-in-out hover:text-white hover:bg-[#E07E65]"
        onClick={() => setInitialPage(false)}
      >
        <PlusOutlined />
        <div>Add a Project</div>
      </div>
    </div>
  );
};

export default ProjectsDashboard;
