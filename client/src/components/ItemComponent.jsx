// prettier-ignore
const ItemComponent = ({image = "", title = "Title", descriptions = ["Description 1"],
className = "", isMoreDetails = false, linkMoreDetails = ""}) => {
  let isImageExist = image !== "";
  return (
    <>
      <div className={className}>
        {isImageExist ? <img src={image} width={200} alt={title} /> : ""}
        <h2>{title}</h2>
        {descriptions.map((item, index) => {
          return(
          <p key={index}>{item}</p>
        )})}
        {isMoreDetails ? <a href={linkMoreDetails}>Xem chi tiết</a> : ""}
      </div>
    </>
  );
};
export default ItemComponent;
