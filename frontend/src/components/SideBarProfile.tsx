import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { uploadAvatar, deleteAvatar, updateGroupMessage } from '@/services/userService';
import { getMyGroups, type PlayGroup } from '@/services/playGroupService';

export function SideBarProfile() {
  const { logout, user, refreshUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [groups, setGroups] = useState<PlayGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [savingMessage, setSavingMessage] = useState(false);

  const handleOpenMessageModal = async () => {
    const gs = await getMyGroups();
    setGroups(gs);
    setSelectedGroupId(gs.length === 1 ? gs[0].id : null);
    setMessageInput('');
    setShowMessageModal(true);
  };

  const handleSaveMessage = async () => {
    if (!selectedGroupId) return;
    setSavingMessage(true);
    try {
      await updateGroupMessage(selectedGroupId, messageInput);
      setShowMessageModal(false);
    } finally {
      setSavingMessage(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be re-selected later
    e.target.value = '';

    setIsUploading(true);
    try {
      await uploadAvatar(file);
      await refreshUser();
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploading(true);
    try {
      await deleteAvatar();
      await refreshUser();
    } finally {
      setIsUploading(false);
    }
  };

  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : '?';

  return (
    <>
      {/* Hidden file input — accepts images only */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="h-10 w-10 border transition-transform hover:scale-105">
            {isUploading ? (
              <AvatarFallback className="animate-pulse text-xs">...</AvatarFallback>
            ) : user?.avatar_url ? (
              <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
            ) : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? t('sidebar.uploading') : t('sidebar.uploadPhoto')}
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleOpenMessageModal}
          >
            💬 {t('sidebar.editMessage') ?? 'Edit group message'}
          </DropdownMenuItem>

          {user?.avatar_url && (
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={handleRemovePhoto}
              disabled={isUploading}
            >
              {t('sidebar.removePhoto')}
            </DropdownMenuItem>
          )}

          {user?.admin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-amber-600 focus:bg-amber-50 focus:text-amber-700"
                onClick={() => navigate('/admin')}
              >
                ⚙️ Panel de Admin
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={toggleLanguage} className="cursor-pointer">
            <span className="flex items-center justify-between w-full gap-2">
              <span>{t('sidebar.langFlag')} {t('sidebar.switchTo')}</span>
              <span className="text-xs text-muted-foreground">{t('sidebar.language')}</span>
            </span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            {t('sidebar.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-bold text-lg">Tu mensaje en el grupo 💬</h3>
            <p className="text-sm text-muted-foreground">Escribí algo gracioso para mostrar en el ranking.</p>

            {groups.length > 1 && (
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedGroupId ?? ''}
                onChange={(e) => setSelectedGroupId(Number(e.target.value))}
              >
                <option value="">Elegí un grupo...</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            )}

            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={100}
              placeholder="Ej: Campeón en construcción 🏆"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveMessage()}
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-right">{messageInput.length}/100</p>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMessage}
                disabled={savingMessage || !selectedGroupId}
                className="px-4 py-2 rounded-lg text-sm bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-50"
              >
                {savingMessage ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
