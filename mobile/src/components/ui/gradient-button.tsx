import { Button, styled } from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

const ButtonGradient = styled(LinearGradient, {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  ov: "hidden",
});

export const GradientButton = ({ children, ...props }) => {
  return (
    <Button clipComponent position="relative" p={0} {...props}>
      <ButtonGradient
        colors={["$brandPrimary", "$brandPrimaryLight"]}
        br={props.br || "$12"}
        start={[0, 0]}
        end={[1, 1]}
      />
      {children}
    </Button>
  );
};
