window.onload = init;

function init() {
    // Siempre agrega el event listener al botón "Entrar"
    document.querySelector('.btn-primary').addEventListener('click', login);
}

function login() {
    var name = document.getElementById('input-username').value;
    var pass = document.getElementById('input-password').value;

    axios({
        method: 'post',
        url: 'http://localhost:3000/users/login',
        data: {
            username: name,
            password: pass
        }
    }).then(function (res) {
        if (res.data.code === 200) {
            localStorage.setItem("token", res.data.message);
            window.location.href = "admin.html";
        } else {
            alert(res.data.message || "Usuario y/o contraseña incorrectos");
        }
    }).catch(function (err) {
        alert(err.response?.data?.message || "Error de autenticación");
        console.log(err);
    });
}

users.post("/login", async(req,res,next) => {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";
    const rows = await db.query(query, [username]);

    if (username && password) {
        if (rows.length == 1) {
            const match = await bcrypt.compare(password, rows[0].password);
            if (match) {
                // login exitoso
                const token = jwt.sign({
                    id: rows[0].id,
                    username: rows[0].username
                }, "debugkey");
                return res.status(200).json({ code: 200, message: token });
            } else {
                return res.status(401).json({ code: 401, message: "Contraseña o usuario incorrectos" });
            }
        } else {
            return res.status(401).json({ code: 401, message: "Contraseña o usuario incorrectos" });
        }
    }
    return res.status(400).json({ code: 400, message: "Campos incompletos" });
});
