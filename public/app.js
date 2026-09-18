const ALL_USERS = [
  { id: 1, name: "Nguyễn Văn Phong", role: "admin" },
  { id: 2, name: "Trần Thị Lan", role: "user" },
  { id: 3, name: "Lê Minh Khoa", role: "user" },
];

const whoami = document.getElementById("whoami");
ALL_USERS.forEach((u) => {
  const opt = document.createElement("option");
  opt.value = u.id;
  opt.textContent = `${u.name} (${u.role === "admin" ? "Admin" : "User"})`;
  whoami.appendChild(opt);
});
whoami.addEventListener("change", load);

function currentUserId() {
  return whoami.value;
}
function isAdmin() {
  return ALL_USERS.find((u) => u.id == currentUserId())?.role === "admin";
}

async function api(path, options = {}) {
  const res = await fetch(`/api/users${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", "x-user-id": currentUserId() },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Lỗi");
  return data;
}

async function load() {
  document.getElementById("hint").textContent = isAdmin()
    ? "Bạn đang là admin: có thể sửa, xóa và phân quyền mọi tài khoản."
    : "Bạn đang là user: chỉ có thể sửa tài khoản của chính mình.";
  document.getElementById("btnAdd").disabled = !isAdmin();

  const users = await api("");
  render(users);
}

function render(users) {
  const rows = document.getElementById("rows");
  rows.innerHTML = "";

  users.forEach((u) => {
    const isSelf = u.id == currentUserId();
    const canEdit = isAdmin() || isSelf;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td><span class="badge ${u.role === "admin" ? "badge-admin" : "badge-user"}">${u.role === "admin" ? "Admin" : "User"}</span></td>
      <td class="row-actions">
        <button class="btn btn-blue" ${canEdit ? "" : "disabled"} data-act="edit" data-id="${u.id}">Sửa</button>
        <button class="btn btn-amber" ${isAdmin() ? "" : "disabled"} data-act="role" data-id="${u.id}">Phân quyền</button>
        <button class="btn btn-red" ${isAdmin() && !isSelf ? "" : "disabled"} data-act="delete" data-id="${u.id}">Xóa</button>
      </td>`;
    rows.appendChild(tr);
  });
}

document.getElementById("rows").addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const id = btn.dataset.id;

  try {
    if (btn.dataset.act === "edit") {
      const name = prompt("Tên mới:");
      if (name) await api(`/${id}`, { method: "PUT", body: JSON.stringify({ name }) });
    }
    if (btn.dataset.act === "role") {
      const role = prompt("Nhập quyền mới (admin / user):");
      if (role === "admin" || role === "user")
        await api(`/${id}/role`, { method: "PUT", body: JSON.stringify({ role }) });
    }
    if (btn.dataset.act === "delete") {
      if (confirm("Xóa tài khoản này?")) await api(`/${id}`, { method: "DELETE" });
    }
    load();
  } catch (err) {
    alert(err.message);
  }
});

document.getElementById("btnAdd").addEventListener("click", async () => {
  const name = prompt("Họ tên:");
  const email = prompt("Email:");
  if (!name || !email) return;
  try {
    await api("", { method: "POST", body: JSON.stringify({ name, email, role: "user" }) });
    load();
  } catch (err) {
    alert(err.message);
  }
});

load();
