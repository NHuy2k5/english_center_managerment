import ButtonComponent from "./ButtonComponent";
// prettier-ignore
const FormRegister = () => {
 
  return (
    <>
      <form action="">
        <input className="text-input" name="firstname_input" type="text" placeholder="Họ"/>
        <input className="text-input" name="lastname_input" type="text" placeholder="Tên"/>
        <input className="text-input"name="phone_input"type="text" placeholder="Số điện thoại"/>
        <input className="text-input" name="phone_input" type="text" placeholder="Số điện thoại"/>
        <input className="text-input" name="email_input" type="email" placeholder="Email"/>
        <input className="text-input" name="email_input" type="email" placeholder="Email"/>
        <ButtonComponent titleName={"Đăng ký ngay"} />
      </form>
    </>
  );
};
export default FormRegister;
