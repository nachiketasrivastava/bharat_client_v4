import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import { initialPageAtom } from "../../store/atoms/ProjectsAtoms";

import ProjectsDashboard from "../../components/ProjectsDashboard/ProjectsDashboard";
import CreateProject from "../../components/CreateProject/CreateProject";

// TODO: Get from backend
const projects = [];

const Projects = () => {
  const [initialPage, setInitialPage] = useRecoilState(initialPageAtom);

  useEffect(() => {
    setInitialPage(true);
  }, []);

  return (
    <div className="p-2">
      {initialPage ? <ProjectsDashboard /> : <CreateProject />}
    </div>
  );
};

export default Projects;
