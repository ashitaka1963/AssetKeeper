import { ElLoading } from 'element-plus';

let loadingInstance: any = null;

const startLoading = () => {
  loadingInstance = ElLoading.service({
    lock: true,
    text: 'Loading...',
    background: 'rgba(0, 0, 0, 0.7)',
    customClass: 'color: #6fd4c3'
  });
};

const closeLoading = () => {
  setTimeout(() => {
    loadingInstance.close();
  }, 1000);
};

const loadingUtils = {
  startLoading,
  closeLoading
};

export default loadingUtils;
