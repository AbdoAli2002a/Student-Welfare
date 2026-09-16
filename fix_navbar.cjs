const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(
  "import { auth, db } from '../lib/firebase';\nimport { onAuthStateChanged, signOut } from 'firebase/auth';\nimport { doc, getDoc } from 'firebase/firestore';",
  ""
);

code = code.replace(
  `  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedInUser(user.email?.split('@')[0] || 'طالب');
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserName(docSnap.data().name);
          }
        } catch(e){}
      } else {
        setLoggedInUser(null);
        setUserName('');
      }
    });
    return () => unsubscribe();
  }, []);`,
  ""
);

code = code.replace(
  `  const handleLogin = (username: string) => {
    // State is managed by onAuthStateChanged
    setIsLoginModalOpen(false);
    setCurrentView?.('profile');
  };`,
  `  const handleLogin = (username: string) => {
    setLoggedInUser(username);
    setUserName(username);
    setIsLoginModalOpen(false);
    setCurrentView?.('profile');
  };`
);

code = code.replace(
  `  const handleLogout = async () => {
    await signOut(auth);
    setLoggedInUser(null);
    setCurrentView?.('home');
  };`,
  `  const handleLogout = async () => {
    setLoggedInUser(null);
    setUserName('');
    setCurrentView?.('home');
  };`
);

fs.writeFileSync('src/components/Navbar.tsx', code);
