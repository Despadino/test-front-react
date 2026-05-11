// src/pages/friends/Friends.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usersAPI } from '../../api/usersAPI';
import { friendsAPI } from '../../api/friendsAPI';
import { invitesAPI } from '../../api/invitesAPI';
import { ROUTES } from '../../constants';
import styles from './Friends.module.css';

export default function Friends() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<{ username: string }[]>([]);
  const [myFriends, setMyFriends] = useState<string[]>([]);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const loadData = async () => {
      setLoading(true);
      const users = await usersAPI.getAll();
      const filtered = users.filter(u => u.username !== currentUser.username);
      setAllUsers(filtered);
      const friends = await friendsAPI.get(currentUser.username);
      setMyFriends(friends);
      const invites = await invitesAPI.getPendingForUser(currentUser.username);
      setPendingInvites(invites);
      setLoading(false);
    };
    loadData();
  }, [currentUser]);

  const handleAcceptInvite = async (invite: any) => {
    if (!currentUser) return;
    await friendsAPI.add(currentUser.username, invite.from);
    await friendsAPI.add(invite.from, currentUser.username);
    await invitesAPI.update(invite.id, 'accepted');
    setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
    const updatedFriends = await friendsAPI.get(currentUser.username);
    setMyFriends(updatedFriends);
    showToast(`✅ Приглашение от ${invite.from} принято!`);
  };

  const handleDeclineInvite = async (invite: any) => {
    await invitesAPI.update(invite.id, 'declined');
    setPendingInvites(prev => prev.filter(i => i.id !== invite.id));
    showToast(`❌ Приглашение от ${invite.from} отклонено`);
  };

  const inviteToFriends = async (targetUsername: string) => {
    if (!currentUser) return;
    const isFriend = myFriends.includes(targetUsername);
    if (isFriend) {
      showToast(`❌ ${targetUsername} уже ваш друг`);
      return;
    }
    const userExists = await usersAPI.find(targetUsername);
    if (userExists) {
      const invite = {
        id: `${Date.now()}-${Math.random()}`,
        from: currentUser.username,
        to: targetUsername,
        type: 'team' as const,
        status: 'pending' as const,
        createdAt: Date.now(),
      };
      await invitesAPI.add(invite);
      showToast(`📨 Приглашение отправлено пользователю ${targetUsername}`);
    } else {
      showToast(`Пользователь ${targetUsername} не найден`);
    }
  };

  const removeFromFriends = async (username: string) => {
    if (!currentUser) return;
    await friendsAPI.remove(currentUser.username, username);
    await friendsAPI.remove(username, currentUser.username);
    const updatedFriends = await friendsAPI.get(currentUser.username);
    setMyFriends(updatedFriends);
    showToast(`👋 ${username} удалён из друзей`);
  };

  const searchResults = searchQuery.trim() === '' ? [] : allUsers.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentUser) return null;

  return (
    <div className="page-container">
      <h1 className="page-title">Друзья</h1>

      <input
        type="text"
        placeholder="Поиск пользователей..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className={styles.searchInput}
      />

      {searchQuery.trim() !== '' && (
        <div className={styles.searchResults}>
          <h3>Результаты поиска</h3>
          {loading ? (
            <p>Загрузка...</p>
          ) : searchResults.length === 0 ? (
            <p className={styles.noResults}>Пользователей не найдено</p>
          ) : (
            <div className={styles.userList}>
              {searchResults.map(u => {
                const isAlreadyFriend = myFriends.includes(u.username);
                return (
                  <div key={u.username} className={styles.userCard}>
                    <span className={styles.userName}>
                      {u.username}
                    </span>
                    {isAlreadyFriend ? (
                      <span className={styles.alreadyFriend}>Уже в друзьях</span>
                    ) : (
                      <button onClick={() => inviteToFriends(u.username)}>Пригласить</button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {pendingInvites.length > 0 && (
        <div className={styles.invitePanel}>
          <h3>Входящие приглашения</h3>
          {pendingInvites.map(inv => (
            <div key={inv.id} className={styles.inviteCard}>
              <span>{inv.from} приглашает вас в друзья</span>
              <div>
                <button onClick={() => handleAcceptInvite(inv)}>Принять</button>
                <button onClick={() => handleDeclineInvite(inv)}>Отклонить</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.friendsSection}>
        <h2>Мои друзья ({myFriends.length})</h2>
        {loading ? (
          <p>Загрузка...</p>
        ) : myFriends.length === 0 ? (
          <p className={styles.empty}>У вас пока нет друзей. Пригласите кого-нибудь!</p>
        ) : (
          <div className={styles.teamList}>
            {myFriends.map(username => (
              <div key={username} className={styles.teamCard}>
                <span className={styles.username}>{username}</span>
                <button onClick={() => removeFromFriends(username)}>Удалить</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}