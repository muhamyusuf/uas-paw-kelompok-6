import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

/**
 * Info item component dengan icon dan label/value
 * Digunakan untuk menampilkan informasi detail (travel date, travelers, duration, dll)
 */
export function InfoItem({ icon: Icon, label, value, className = "" }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Icon && (
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
          <Icon className="text-primary h-5 w-5" />
        </div>
      )}
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-foreground font-semibold">{value}</p>
      </div>
    </div>
  );
}

InfoItem.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]).isRequired,
  className: PropTypes.string,
};

/**
 * Compact info item tanpa background icon
 */
export function CompactInfoItem({ icon: Icon, label, value, className = "" }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Icon && <Icon className="text-muted-foreground h-4 w-4" />}
      <span className="text-sm">
        {label && <span className="text-muted-foreground">{label}: </span>}
        {value}
      </span>
    </div>
  );
}

CompactInfoItem.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.node]).isRequired,
  className: PropTypes.string,
};
