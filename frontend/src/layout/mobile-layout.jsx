import PropTypes from "prop-types";
import { MenuDock } from "@/components/menu-mobile";

export default function MobileLayout(
    { children }) {
    return (
        <div className="px-1 md:px-2 w-full md:max-w-7xl mx-auto">
            {children}
            <MenuDock />
        </div>
    )
}

MobileLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
