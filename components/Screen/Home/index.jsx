import { Grid, Typography } from "@mui/material";
import Count from "./Count";

export default function Home() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Selamat datang
      </Typography>

      <Grid container spacing={2}>
        <Grid item>
          <Count title="Jumlah Sekolah terdaftar" type="school" />
        </Grid>

        <Grid item>
          <Count title="Jumlah Peserta terdaftar" type="participant" />
        </Grid>
      </Grid>
    </>
  );
}
