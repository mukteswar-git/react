/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// Real-world prop drilling is a nightmare

function App() {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState({ name: 'Alice' });

  return (
    <Layout theme={theme} language={language} user={user}>
      <Navbar theme={theme} language={language} user={user}>
        <UserMenu theme={theme} user={user}>
          <UserDropdown theme={theme} user={user}>
            <UserProfile user={user} /> {/* Finally used! */}
          </UserDropdown>
        </UserMenu>
      </Navbar>
    </Layout>
  )
}

export default App;