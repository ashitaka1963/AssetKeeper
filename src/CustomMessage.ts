import { ElMessage } from 'element-plus';

const showMessage = (message: any, type: any) => {
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: message,
    type: type
  });
};

export default showMessage;
