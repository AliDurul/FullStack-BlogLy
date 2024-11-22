// import { forgetPassword } from "@/actions/authActions";
import Swal, { SweetAlertPosition } from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";

// const MySwal = withReactContent(Swal);

export const successToast = (msg: string) => {
  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });
  toast.fire({
    icon: "success",
    title: msg,
    padding: "10px 20px",
    // background: '#F3AB0D' // one-life

  });
};

export const coloredToast = (color: string, msg: string, position: SweetAlertPosition = "top-end") => {
  let openEmail = false;
  if (msg.startsWith("Please verify")) {
    openEmail = true;
  }

  const toast = Swal.mixin({
    toast: true,
    position,
    showConfirmButton: false,
    timer: openEmail ? 20000 : 5000,
    showCloseButton: false,
    customClass: {
      popup: `color-${color}`,
    },
  });

  toast.fire({
    title: openEmail
      ? `${msg} <a href="https://mail.google.com/mail/u/0/#search/Strong+Concrete" style="color: black; text-decoration: underline;">Check your inbox!</a>`
      : msg,
  });
};

export const forgetPasswordToast = async () => {
  const { value: email } = await Swal.fire({
    title: "Reset password with Email",
    input: "email",
    inputLabel: "A verification code will be send to this mail account.",
    inputPlaceholder: "Enter your email address",
    showCancelButton: true,
  });
  if (email) {
    // const res = await forgetPassword(email);
    const res = { message: 'sent' }
    if (res?.message) {
      Swal.fire(`${res?.message} Check your emails please.`);
    } else {
      // @ts-ignore
      Swal.fire(res?.error);
    }
  }
};
