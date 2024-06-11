import React, { useState } from 'react';
import { Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import "./Modal.css"



const ShowModal = (props) => {
    const [ModalOpen, setModalOpen] = useState(true);
    // const modalOpen = true;
    // const history = useHistory();
    const navigate = useNavigate();

    const data = props.props;

    const onOk= () => {
       if (data.onOk) {
        data.onOk(); // Call the onOk callback function if provided
      }
        if(data.okAction === 'closeModal'){
          setModalOpen(false);
        }

         else {
          // history.push(data.okAction)
          navigate(data.okAction);
        }
    }

    const onCancel = () => {
      if (data.onCancel) {
        data.onCancel(); // Call the onCancel callback function if provided
      }
      if(data.closeAction === 'closeModal'){
        setModalOpen(false);
      }
      
      else {
        // history.push(data.closeAction)
        navigate(data.closeAction);
      }
    }

    return (
      <>
      {data.title &&
        <Modal
          title={data.title}
          centered
          open={ModalOpen}
          onOk={onOk}
          onCancel={onCancel}
          closable= {false}
          className={'custom-modal'}
        >
        </Modal>
        }
      {data.content &&
        <Modal
        title={data.title}
        centered
        open={ModalOpen}
        onOk={onOk}
        onCancel={onCancel}
        className={'custom-modal'}
        >
        {data.content && <p>{data.content}</p>}
        </Modal>
        }

      </>
    );
};

export default ShowModal;