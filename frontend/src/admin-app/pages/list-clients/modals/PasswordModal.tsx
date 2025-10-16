import React from "react";
import Modal from "react-modal";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserService from "../../../../services/user.service";
import User from "../../../../models/User";
import SubmitButton from "../../../../components/SubmitButton";

const PasswordModal = ({
  userDetails,
  showDialog,
  closeModal,
}: {
  userDetails: User | undefined;
  showDialog: boolean;
  closeModal: (type: string) => void;
}) => {
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    // transactionPassword: Yup.string().required('Transaction Password is required'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<{
    password: string;
    confirmPassword: string;
    transactionPassword: string;
  }>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      transactionPassword: "123456", // ✅ Set default value for transaction password
    },
  });

  React.useEffect(() => {
    setValue("transactionPassword", "123456");
  }, [setValue]);

  // ✅ Function to generate password like Ab123456
  const generatePassword = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const firstPart =
      letters.charAt(Math.floor(Math.random() * letters.length)) +
      letters.charAt(Math.floor(Math.random() * letters.length));
    let numberPart = "";
    for (let i = 0; i < 6; i++) {
      numberPart += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return firstPart + numberPart;
  };

  const [pass, setPass] = React.useState("");

  // ✅ Auto-generate and fill password on open
  React.useEffect(() => {
    if (showDialog) {
      const autoPassword = generatePassword();
      setPass(autoPassword)
      setValue("password", autoPassword);
      setValue("confirmPassword", autoPassword);
      setValue("transactionPassword", "123456");
    }
  }, [showDialog, setValue]);

  const onSubmit = handleSubmit((data) => {
    const formData = { ...data, username: userDetails?.username };

    UserService.updatePassword(formData).then(() => {
      closeModal("p");
       // ✅ Prepare the text to copy
      const copyText = `LINK: bxpro99.xyz/admin/login
       ID: ${userDetails?.username}
       PW: ${pass}`;
      // ✅ Copy to clipboard
      navigator.clipboard.writeText(copyText);
      toast.success("Password Updated & Copy Successfully");
      reset();
    });
    // copy functiolality

    console.log(data, "check txn");
  });

  return (
    <>
      <Modal
        isOpen={showDialog}
        onRequestClose={() => {
          closeModal("p");
          reset();
        }}
        contentLabel="Password"
        className={"modal-dialog mx-4"}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title text-white">Reset Password</h4>
            <button
              type="button"
              className="close text-white"
              data-dismiss="modal"
              onClick={() => {
                closeModal("p");
                reset();
              }}
            >
              ×
            </button>
          </div>
          <form id="PasswordForm" onSubmit={onSubmit}>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="row m-b-20 d-none">
                  <div className="col-md-4">
                    <label>New Password</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type=""
                      className="form-control"
                      id="new-password"
                      {...register("password")}
                      // maxLength={8}
                    />
                    {errors?.password && (
                      <span id="password-error" className="error">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="row m-b-20 d-none">
                  <div className="col-md-4">
                    <label>Confirm Password</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      type=""
                      className="form-control"
                      id="confirm-password"
                      {...register("confirmPassword")}
                      // maxLength={8}
                    />
                    {errors?.confirmPassword && (
                      <span id="password_confirmation-error" className="error">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="container border p-3 mb-3">
                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">New Password</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">LINK</div>
                    <div className="col-md-8">bxpro99.xyz/admin/login</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">ID</div>
                    <div className="col-md-8">{userDetails?.username}</div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-4 fw-bold">PW</div>
                    <div className="col-md-8">{pass}</div>
                  </div>

                  {/* <div className="row mb-2">
                    <div className="col-md-4 fw-bold">OTP</div>
                    <div className="col-md-8">503919</div>
                  </div> */}
                </div>

                {/* <div className='row m-b-20'>
                  <div className='col-md-4'>
                    <label>Transaction Password</label>
                  </div>
                  <div className='col-md-8'>
                    <input type='Password' id='mpassword' {...register('transactionPassword')} />
                    {errors?.transactionPassword && (
                      <span className='error'>{errors.transactionPassword.message}</span>
                    )}
                  </div>
                </div> */}
              </div>
            </div>
            <div className="modal-footer">
              <input type="hidden" id="password-uid" />
              <button
                type="button"
                className="btn btn-back bg-primary text-white"
                data-dismiss="modal"
                onClick={() => {
                  closeModal("p");
                  reset();
                }}
              >
                <i className="fas fa-undo" />
                Back
              </button>
              <SubmitButton type="submit" className="btn btn-submit bg-primary text-white">
                Submit & Copy
                <i className="fas fa-sign-in-alt" />
              </SubmitButton>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default PasswordModal;
