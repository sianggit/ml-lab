import useMediaQuery from "@mui/material/useMediaQuery";

const useDeviceType = () => {
    const isMobileSmall = useMediaQuery("(max-width:425px)");
    const isMobile = useMediaQuery("(max-width:767px)");
    const isTablet = useMediaQuery("(min-width:768px) and (max-width:1180px)");
    const isDesktop = useMediaQuery("(min-width:1181px)");

    return { isMobileSmall, isMobile, isTablet, isDesktop };
};

export default useDeviceType;
