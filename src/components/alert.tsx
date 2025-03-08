import Alerts from '../enums/alerts';

const AlertComponent: React.FC<{
  showAlert: boolean;
  alertType: Alerts;
  message: string;
  onCloseAlert: () => void;
}> = ({ alertType, message, showAlert, onCloseAlert }) => {
  return (
    <>
      {showAlert && (
        <div style={{ position: 'fixed', bottom: '1rem', right: '1rem' }}>
          <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
            {message}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={onCloseAlert}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertComponent;
