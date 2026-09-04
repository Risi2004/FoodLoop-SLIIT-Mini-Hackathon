import './UserManagement.css'

const USERS = [
  { id: 'u1', name: 'Green Kitchen Collective', email: 'donations@greenkitchen.lk', role: 'DONOR', status: 'Active' },
  { id: 'u2', name: 'Hope Community Kitchen', email: 'hope@community.lk', role: 'RECEIVER', status: 'Active' },
  { id: 'u3', name: 'A. Perera', email: 'driver.perera@foodloop.lk', role: 'DRIVER', status: 'Active' },
  { id: 'u4', name: 'Fresh Basket Market', email: 'ops@freshbasket.lk', role: 'DONOR', status: 'Pending' },
  { id: 'u5', name: 'City Shelter Network', email: 'intake@cityshelter.lk', role: 'RECEIVER', status: 'Suspended' },
]

export default function UserManagement() {
  return (
    <div className="user-management">
      <div className="page user-management__inner">
        <header className="fl-section-head user-management__head">
          <h2>User Management</h2>
          <p>Mock directory of FoodLoop accounts</p>
        </header>

        <div className="user-management__table-wrap page-stub">
          <table className="user-management__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="user-management__role">{user.role}</span>
                  </td>
                  <td>
                    <span
                      className={`user-management__status is-${user.status.toLowerCase()}`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
