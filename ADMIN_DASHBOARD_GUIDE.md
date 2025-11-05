# Admin Dashboard Quick Reference

## Access URL

```
http://localhost:3000/vi/admin
http://localhost:3000/en/admin
```

## Default Login

- **Email**: admin@example.com
- **Password**: Admin@123456

## Navigation Tabs

### 1. 📝 Posts Tab (Default)

**URL Hash**: `#posts`

**Features**:

- View all posts in table format
- Search posts by title
- Create new post
- Edit existing post
- Delete post
- See post statistics (Total, Published, Drafts)

**Actions**:

- **New Post**: Click "New Post" button → Opens editor
- **Edit**: Click edit icon → Opens editor with post data
- **Delete**: Click trash icon → Confirm deletion

---

### 2. 🏷️ Tags Tab

**URL Hash**: `#tags`

**Features**:

- View all tags
- Search tags
- Create new tag
- Delete tag
- Auto-generate slug from tag name

**Actions**:

- **New Tag**: Click "New Tag" button → Shows inline form
- **Create**: Enter name, press Enter or click "Create"
- **Delete**: Click trash icon → Confirm deletion

**Example**:

```
Tag Name: "Technology"
Auto Slug: "technology"
```

---

### 3. ⚙️ Settings Tab

**URL Hash**: `#settings`

**Sections**:

#### Profile Information

- Update display name
- Update email address
- Save changes

#### Change Password

- Enter new password (min 8 chars)
- Confirm new password
- Save password

#### Account Information

- View user role (Admin/User)
- View user ID (read-only)

**Actions**:

- **Save Profile**: Click "Save Profile" button
- **Change Password**: Click "Change Password" button

---

### 4. 🚪 Logout

**Location**: Bottom of sidebar

**Action**:

- Click "Logout" button
- Clears authentication token
- Redirects to home page

---

## Keyboard Shortcuts

### Tags Creation

- `Enter` - Create tag
- `Escape` - Cancel creation

### Navigation

- Click sidebar items to switch tabs
- Use browser back/forward with hash URLs

---

## Status Indicators

### Posts

- 🟢 **Published** - Green badge
- 🟡 **Draft** - Yellow badge

### Messages

- ✅ **Success** - Green background, auto-dismisses
- ❌ **Error** - Red background, auto-dismisses

---

## Data Table Features

### Posts Table

| Column  | Description                     |
| ------- | ------------------------------- |
| Title   | Post title (clickable for edit) |
| Status  | Published or Draft              |
| Date    | Creation date                   |
| Actions | Edit and Delete buttons         |

### Tags Table

| Column  | Description             |
| ------- | ----------------------- |
| Name    | Tag display name        |
| Slug    | URL-friendly identifier |
| Created | Creation date           |
| Actions | Delete button           |

---

## Quick Actions

### Create Post Flow

1. Click "Posts" in sidebar
2. Click "New Post" button
3. Fill in post details
4. Click "Save" or "Publish"

### Create Tag Flow

1. Click "Tags" in sidebar
2. Click "New Tag" button
3. Enter tag name
4. Press Enter

### Update Profile Flow

1. Click "Settings" in sidebar
2. Modify name or email
3. Click "Save Profile"

### Change Password Flow

1. Click "Settings" in sidebar
2. Scroll to "Change Password"
3. Enter new password twice
4. Click "Change Password"

---

## Responsive Behavior

### Desktop (≥768px)

- Sidebar always visible
- Full table columns shown
- Statistics in 3-column grid

### Mobile (<768px)

- Sidebar toggles with hamburger menu
- Tables scroll horizontally
- Statistics stack vertically

---

## Common Issues & Solutions

### Issue: Not redirecting to dashboard after login

**Solution**: Check browser console for errors, verify JWT token in localStorage

### Issue: Tags not loading

**Solution**: Ensure backend `/api/tags` endpoint is running

### Issue: Can't update profile

**Solution**: Verify user ID is correct, check API permissions

### Issue: Logout not working

**Solution**: Check browser console, ensure localStorage is accessible

---

## API Endpoints Used

```
Auth:
POST   /api/auth/login
GET    /api/auth/profile

Posts:
GET    /api/posts
POST   /api/posts
PUT    /api/posts/:id
DELETE /api/posts/:id

Tags:
GET    /api/tags
POST   /api/tags
DELETE /api/tags/:id

Users:
GET    /api/users/me
PUT    /api/users/:id
```

---

## Development Notes

### File Structure

```
components/admin/
  ├── admin-dashboard.tsx    - Main router
  ├── admin-layout.tsx       - Layout wrapper
  ├── admin-sidebar.tsx      - Navigation menu
  ├── post-editor.tsx        - Post creation/editing
  ├── tags-manager.tsx       - Tag management
  └── settings-manager.tsx   - User settings

app/[locale]/admin/
  └── page.tsx               - Admin route handler
```

### State Management

- Tab state: useState in page.tsx
- URL hash: window.location.hash
- Auth state: useAuth() context
- Blog data: useBlog() context

---

## Tips & Tricks

1. **Bookmark with Hash**: Save `/admin#tags` for quick access
2. **Search First**: Use search before scrolling through long lists
3. **Keyboard Navigation**: Tab through form fields efficiently
4. **Auto-Save**: Consider saving drafts periodically
5. **Batch Operations**: Delete multiple tags before creating new ones

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
