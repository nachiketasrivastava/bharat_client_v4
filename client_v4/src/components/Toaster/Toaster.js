import { useEffect } from 'react';
import { message } from 'antd';

const Toaster = (props) => {
    const [messageApi, contextHolder] = message.useMessage();

    const ShowMessage = () => {
        messageApi.open({
            type: props.props.type,
            content: props.props.content
        })
    }

    useEffect(() => {
        ShowMessage()
    })

    return contextHolder;
};

export default Toaster;