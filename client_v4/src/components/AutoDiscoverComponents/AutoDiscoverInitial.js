import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import './AutoDiscoverInitial.css'
import logo from "../../assets/images/logoWOname.png";
import { jwtDecode } from "jwt-decode";
import { Button } from "antd";


const AutoDiscoverInitial = () => {
  const userinformation = jwtDecode(localStorage.getItem('loginToken').replace(process.env.REACT_APP_TOKEN_PASSCODE, ''))

  return (
      <div className={`w-[100%] mt-[10%] flex justify-center items-center`}>
        <div className="p-10 gap-10 flex justify-center flex-col bg-[whitesmoke] w-[70%] mt-[-50px] h-[400px]" style={{borderRadius: "80px", border: "0.5px solid grey"}}>
            <div className="gap-8 justify-center flex items-center " >
                <img
                  src={logo}
                  alt="brand-logo"
                  width={55}
                  className="mt-1"
                />
                <div className="text-[17px] font-[500]">
                    <p>
                    Hey Navigator. This space helps you launch agents to automatically and persistently find you the most relevant leads. 
                    On your current plan, these leads will show up once a week and are based on your ICP definition and predefined triggers you can read more about here.
                    </p>
                    <p className="mt-4">
                    To get your first lead agent launched please  press continue below and give us your ICP and persona definitions.
                    </p>
                </div>
            </div>
            <div className="flex justify-center">
                <Button>Define ICP</Button>
            </div>
        </div>
      </div>
  )
};

export default AutoDiscoverInitial;
