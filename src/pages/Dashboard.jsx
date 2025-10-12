import { Box, Grid, Card, CardContent, Typography, Paper } from "@mui/material"
import { Stack, Chip } from "@mui/material"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import SupplierImg from "../assets/supplier.png"
import ProductImg from "../assets/product.png"
import cardAnalytics1 from "../assets/card-analytics-1.png"




function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600} mb={3}>
        Dashboard
      </Typography>
      <Box sx={{display:"flex", flexDirection:{xs:"column",md:"row"}, gap:3, width:"100%"  }}>
 <Card
  sx={(theme) => ({
    // The only change is here
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    
    // The rest of your styles are perfect
    color: "white",
    borderRadius: 3,
    p: 2,
    width: { xs: "100%", md: "50%" },
    position: "relative",
  })}
>
      {/* Dots top-right */}
      {/* <Box position="absolute" top={16} right={16} display="flex" gap={0.5}>
        <FiberManualRecordIcon sx={{ fontSize: 8, color: "white" }} />
        <FiberManualRecordIcon sx={{ fontSize: 8, color: "white", opacity: 0.5 }} />
        <FiberManualRecordIcon sx={{ fontSize: 8, color: "white", opacity: 0.5 }} />
      </Box>   */}

    

      {/* Traffic + stats */}
      <Box display={"flex"} justifyContent={"space-between"}>
      <Box display="flex" flexDirection={"column"} justifyContent="space-between"  >
          {/* Title */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Analytics
      </Typography>
      <Typography variant="body1" gutterBottom>
        Total 28.5% Conversion Rate
      </Typography>
        <Box mt={3}>
          <Stack direction="row" spacing={2} alignItems="center" mb={1}>
            <Chip label="28%" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white" }} />
            <Typography variant="body2">Supplier</Typography>
            <Chip label="3.1k" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white" }} />
            <Typography variant="body2">Items</Typography>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            <Chip label="1.2k" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white" }} />
            <Typography variant="body2">Leads</Typography>
            <Chip label="12%" size="small" sx={{ background: "rgba(255,255,255,0.2)", color: "white" }} />
            <Typography variant="body2">Conversions</Typography>
          </Stack>
        </Box>

        {/* 3D Sphere / Image */}
       
      </Box>
       <Box
          component="img"
          src={cardAnalytics1} // replace with your actual image or SVG
          alt="3D Sphere"
          sx={{ width: 150, height: 150 }}
        />
        </Box>
    </Card>
   
    <Box sx={{display:"flex",  width:{ xs: "100%", md:"50%"}, gap:3}}>
       {/* suppliers */}
      <Card sx={{width:"50%" , p:2}} ><Typography variant="h5" fontWeight={500} >Total Suppliers</Typography>
      <Typography variant="h4" fontWeight={600} mt={3} >50+</Typography>
      <Box display={"flex"} alignItems="center" justifyContent="center">
        <Box
    component="img"
    src={SupplierImg} // replace with your image path
    alt="Suppliers"
    
    sx={{
      width: 100,
      height: 100,
      objectFit: "contain",
    }}
  /></Box>
      </Card>
      {/* items */}
      <Card sx={{width:"50%", p:2}}><Typography variant="h5" fontWeight={500} >Total Items</Typography>
      <Typography variant="h4" fontWeight={600} mt={3} >100+</Typography>
       <Box display={"flex"} alignItems="center" justifyContent="center">
        <Box
    component="img"
    src={ProductImg} // replace with your image path
    alt="Suppliers"
    
    sx={{
      width: 100,
      height: 100,
      objectFit: "contain",
    }}
  /></Box></Card>
    </Box>
    </Box>


     <Box sx={{display:"flex", gap:3, flexDirection:{xs:"column",md:"row"}  , mt:3  }}>
  
    <Box sx={{display:"flex",width:{ xs: "100%", md:"50%"}, gap:3}}>
      <Card sx={{width:{ xs: "100%", md:"50%"} , p:2}} ><Typography variant="h6" fontWeight={500} >Lowest Price Items</Typography>
      <Typography variant="h6" fontWeight={400} mt={1} >steel</Typography>
      <Typography variant="h4" fontWeight={600} mt={3} >$50</Typography></Card>
      <Card sx={{width:{ xs: "100%", md:"50%"}, p:2}}><Typography variant="h6" fontWeight={500} >Trending products</Typography>
      <Typography variant="h6" fontWeight={400} mt={1} >iron</Typography>
      <Typography variant="h4" fontWeight={600} mt={3} >50+</Typography></Card>
    </Box>
    <Box sx={{display:"flex", width:{ xs: "100%", md:"50%"}, gap:3}}>
      <Card sx={{width:{ xs: "100%", md:"50%"} , p:2}} ><Typography variant="h6" fontWeight={500} >Regular Supplier</Typography>
      <Typography variant="body1" fontWeight={400} mt={1} >Digital Innovations 123</Typography>
      <Typography variant="h4" fontWeight={600} mt={3} >15+ yr</Typography></Card>
      <Card sx={{width:{ xs: "100%", md:"50%"}, p:2}}><Typography variant="h6" fontWeight={500} >Digital Innovations 123</Typography>
          <Typography variant="h6" fontWeight={400} mt={1} >iron</Typography>
      <Typography variant="h4" fontWeight={600} mt={3} >50+</Typography></Card>
    </Box>
    </Box>
    
    
   
   
    </Box>
  )
}

export default Dashboard
