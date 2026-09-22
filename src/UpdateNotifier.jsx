import { useEffect, useState } from 'react';

function UpdateNotifier() {
  const [stage, setStage] = useState('idle'); // idle | notify | info | downloading | ready
  const [info, setInfo] = useState(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    window.updater.onUpdateAvailable((data) => {
      setInfo(data);
      setStage('notify');
    });
    window.updater.onDownloadProgress((p) => setPercent(p));
    window.updater.onUpdateDownloaded(() => setStage('ready'));
    window.updater.onError((msg) => console.error('Update error:', msg));
    window.updater.onDebug((msg) => console.log('[Update Debug]', msg));
  }, []);

  if (stage === 'idle') return null;

  return (
    <div style={overlayStyle}>
      <div style={boxStyle}>
        {stage === 'notify' && (
          <>
            <p>Đã có bản cập nhật mới. Vui lòng cập nhật ứng dụng.</p>
            <button onClick={() => setStage('info')}>Cập nhật</button>
            <button onClick={() => setStage('idle')}>Bỏ qua</button>
          </>
        )}

        {stage === 'info' && (
          <>
            <h3>Phiên bản mới: {info?.version}</h3>
            <p>{info?.releaseNotes || 'Không có ghi chú phát hành.'}</p>
            <button onClick={() => { setStage('downloading'); window.updater.startDownload(); }}>
              Cập nhật
            </button>
            <button onClick={() => setStage('idle')}>Hủy</button>
          </>
        )}

        {stage === 'downloading' && <p>Đang tải bản cập nhật... {percent}%</p>}

        {stage === 'ready' && (
          <>
            <p>Đã tải xong. Khởi động lại để cài đặt.</p>
            <button onClick={() => window.updater.quitAndInstall()}>Cài đặt ngay</button>
          </>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const boxStyle = {
  background: '#fff', padding: '24px', borderRadius: '8px',
  minWidth: '320px', textAlign: 'center',
};

export default UpdateNotifier;