import { ButtonStyle } from "./Button.styled";

export const Button = ({ onClickRender }) => (
    <ButtonStyle type="button" onClick={onClickRender}>Load more</ButtonStyle>
);