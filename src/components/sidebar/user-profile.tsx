import { useAuth } from "@/context/auth.context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { APP_ROUTES } from "@/lib/constants";
import { motion } from "framer-motion";

interface UserProfileProps {
  hasAnimated: boolean;
}

export function UserProfile({ hasAnimated }: UserProfileProps) {
  const { getAuthUser } = useAuth();
  const user = getAuthUser();

  return (
    <motion.div
      className="flex items-center gap-3"
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={() => (window.location.href = APP_ROUTES.PROFILE)}
      style={{ cursor: "pointer" }}
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Avatar>
          <AvatarImage alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            {user?.username?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </motion.div>
      <div className="flex flex-col">
        <motion.span
          initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-medium"
        >
          {user?.username}
        </motion.span>
        <motion.span
          initial={hasAnimated ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-muted-foreground"
        >
          {user?.email}
        </motion.span>
      </div>
    </motion.div>
  );
}
