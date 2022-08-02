import { Dialog } from "@mui/material";
import useIsMobile from "hooks/useIsMobile";

const componentDetails = {
  school: require("./School").default,
  participant: require("./Participant").default,
};

export default function Create({ open, type, onClose, fetchRows }) {
  const isMobile = useIsMobile();

  const ComponentDetail = componentDetails[type];
  if (!ComponentDetail) return null;

  return (
    <Dialog
      fullScreen={isMobile}
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="md"
    >
      <ComponentDetail type={type} onClose={onClose} fetchRows={fetchRows} />
    </Dialog>
  );
}
