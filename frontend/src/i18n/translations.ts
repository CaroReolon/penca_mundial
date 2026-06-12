const translations = {
  es: {
    // Login
    'login.title': 'Iniciar sesión',
    'login.password': 'Contraseña',
    'login.error': 'Email o contraseña incorrectos',
    'login.loading': 'Ingresando...',
    'login.submit': 'Ingresar',
    'login.noAccount': '¿No tiene cuenta?',
    'login.signUp': 'Regístrese',
    'login.forgotPassword': '¿Olvidó su contraseña?',

    // Forgot password
    'forgot.title': 'Recuperar contraseña',
    'forgot.subtitle':
      'Ingrese su email y le generaremos un token de recuperación.',
    'forgot.submit': 'Generar token',
    'forgot.loading': 'Generando...',
    'forgot.error': 'Ocurrió un error. Inténtelo de nuevo.',
    'forgot.emailSent': 'Revise su email',
    'forgot.emailHint':
      'Le enviamos un enlace para restablecer su contraseña. Expira en 6 horas.',
    'forgot.goToReset': 'Ir a restablecer contraseña →',
    'forgot.backToLogin': '← Volver al inicio de sesión',

    // Reset password
    'reset.title': 'Restablecer contraseña',
    'reset.subtitle': 'Ingrese el token de recuperación y su nueva contraseña.',
    'reset.subtitleToken': 'Elija su nueva contraseña.',
    'reset.tokenLabel': 'Token de recuperación',
    'reset.tokenPlaceholder': 'Pegue su token aquí',
    'reset.passwordLabel': 'Nueva contraseña',
    'reset.confirmLabel': 'Confirmar contraseña',
    'reset.submit': 'Restablecer contraseña',
    'reset.loading': 'Restableciendo...',
    'reset.mismatch': 'Las contraseñas no coinciden.',
    'reset.error': 'Token inválido o expirado.',
    'reset.success': '¡Contraseña actualizada! Ya puede iniciar sesión.',
    'reset.backToLogin': '← Volver al inicio de sesión',

    // Register
    'register.title': 'Crear cuenta',
    'register.firstName': 'Nombre',
    'register.lastName': 'Apellido',
    'register.firstNamePlaceholder': 'John',
    'register.lastNamePlaceholder': 'Doe',
    'register.emailPlaceholder': 'john@ejemplo.com',
    'register.password': 'Contraseña',
    'register.confirmPassword': 'Confirmar contraseña',
    'register.required': 'Requerido',
    'register.minLength': 'Mínimo 6 caracteres',
    'register.passwordMismatch': 'Las contraseñas no coinciden',
    'register.submit': 'Crear cuenta',
    'register.loading': 'Creando cuenta...',
    'register.error': 'Error al crear la cuenta.',
    'register.hasAccount': '¿Ya tiene cuenta?',
    'register.signIn': 'Inicie sesión',

    // Dashboard
    'dashboard.title': '🏆 Penca Mundial 2026',
    'dashboard.subtitle':
      'Pronostique los partidos, sume puntos y domine la tabla.',
    'dashboard.tab.upcoming': 'Próximos',
    'dashboard.tab.results': 'Mis Resultados',
    'dashboard.tab.ranking': 'Ranking',
    'upcoming.filterMissing': 'Sin pronóstico',
    'upcoming.filterActive': 'Mostrando solo partidos sin pronóstico',
    'upcoming.filterEmpty': 'Todos los partidos tienen pronóstico 🎉',
    'filter.allStages': 'Todas las fases',
    'filter.allGroups': 'Todos los grupos',
    'filter.group': 'Grupo',
    'filter.noMatches': 'No hay partidos para los filtros seleccionados.',

    // MatchCard
    'match.group': 'Grupo',
    'match.stage.group_stage': 'Fase de grupos',
    'match.stage.round_of_32': 'Ronda de 32',
    'match.stage.round_of_16': 'Octavos de final',
    'match.stage.quarter_final': 'Cuartos de final',
    'match.stage.semi_final': 'Semifinal',
    'match.stage.third_place': 'Tercer puesto',
    'match.stage.final': 'Final',
    'match.saved': '✓ Predicción guardada',
    'match.saving': 'Guardando...',
    'match.update': 'Actualizar predicción',
    'match.save': 'Guardar predicción',

    // PastMatchCard
    'past.myPrediction': 'Su pronóstico',
    'past.final': 'Finalizado',
    'past.point': 'punto',
    'past.points': 'puntos',
    'past.inProgress': 'En curso',
    'past.noPrediction': 'Sin pronóstico',
    'past.liveNotice': 'En juego · resultado no definitivo',
    'past.processingNotice':
      'Procesando resultado · puede no estar actualizado',

    // UserProfile
    'profile.back': '← Volver',
    'profile.loading': 'Cargando...',
    'profile.totalPoints': 'pts totales',
    'profile.predictions': 'pronósticos',
    'profile.empty': 'aún no tiene pronósticos registrados.',
    'profile.position': 'Puesto',
    'profile.predictionOf': 'Pronóstico de',

    // Sidebar
    'sidebar.profile': '👤 Mi Perfil',
    'sidebar.settings': '⚙️ Configuración',
    'sidebar.logout': '🚪 Cerrar sesión',
    'sidebar.language': 'Idioma',
    'sidebar.switchTo': 'English',
    'sidebar.langFlag': '🇺🇸',
    'sidebar.uploadPhoto': 'Cambiar foto',
    'sidebar.removePhoto': 'Eliminar foto',
    'sidebar.uploading': 'Subiendo...',

    // MatchHistory
    'history.empty':
      '😶 Todavía no hay resultados registrados. ¡Los partidos aparecerán aquí una vez que finalicen!',
    'history.scoring.title': '¿Cómo se calculan los puntos?',
    'history.scoring.exact.pts': '5 puntos',
    'history.scoring.exact.label': 'Resultado exacto',
    'history.scoring.exact.desc':
      'Acertó el marcador exacto del partido (ej.: pronosticó 2-1 y terminó 2-1).',
    'history.scoring.diff.pts': '3 puntos',
    'history.scoring.diff.label': 'Diferencia de goles correcta',
    'history.scoring.diff.desc':
      'Acertó la diferencia de goles pero no el marcador exacto. Incluye los empates: si pronosticó empate y el partido terminó empatado, suma 3 puntos (ej.: pronosticó 1-1 y terminó 0-0).',
    'history.scoring.winner.pts': '2 puntos',
    'history.scoring.winner.label': 'Ganador correcto',
    'history.scoring.winner.desc':
      'Acertó qué equipo ganó, pero no la diferencia de goles ni el marcador exacto. No aplica a empates.',
    'history.scoring.zero.pts': '0 puntos',
    'history.scoring.zero.label': 'Sin acierto',
    'history.scoring.zero.desc': 'El resultado fue diferente a su pronóstico.',

    // Ranking
    'ranking.empty':
      '🏆 ¡Aún no hay participantes en este ranking! Sea el primero en sumar puntos.',
    'ranking.pos': 'Pos',
    'ranking.participant': 'Participante',
    'ranking.trend': 'Tendencia',
    'ranking.points': 'Puntos',
    'ranking.place': 'Puesto',
    'ranking.pts': 'pts',
    'ranking.rising': '▲ Subiendo',
    'ranking.risingIcon': '▲',
    'ranking.falling': '▼ Bajando',
    'ranking.fallingIcon': '▼',
    'ranking.steady': '= Manteniendo',
    'ranking.steadyIcon': '-',
    'ranking.newGroup': '+ Nuevo grupo',
    'ranking.loading': 'Cargando...',
    'ranking.loadingRanking': 'Cargando ranking...',
    'ranking.noGroups.title': 'Aún no pertenece a ningún grupo',
    'ranking.noGroups.desc':
      'Cree un grupo e invite a sus amigos, familiares o compañeros para comparar pronósticos.',
    'ranking.noGroups.cta': '+ Crear mi primer grupo',
    'ranking.noParticipants':
      'Este grupo aún no tiene participantes. Invite a sus amigos usando ⚙️.',

    // Group panel
    'group.membersTitle': 'Miembros',
    'group.memberSingular': 'miembro',
    'group.memberPlural': 'miembros',
    'group.youLabel': '(usted)',
    'group.roleAdmin': '👑 Admin',
    'group.roleMember': 'Miembro',
    'group.invite.title': 'Invitar al grupo',
    'group.invite.generate': '🔗 Generar link de invitación',
    'group.invite.hint':
      'Comparta el link por WhatsApp, Telegram o como prefiera',
    'group.invite.copy': 'Copiar link',
    'group.invite.copied': '✓ Copiado',
    'group.leave': 'Salir del grupo',
    'group.delete': 'Eliminar grupo',
    'group.done': 'Listo',
    'group.create.title': 'Crear nuevo grupo',
    'group.create.placeholder': 'Ej.: Familia, Trabajo, Amigos...',
    'group.create.cancel': 'Cancelar',
    'group.create.submit': 'Crear grupo',
    'group.create.loading': 'Creando...',
    'group.manage': 'Gestionar grupo',
    'group.privateProfile': '🔒 Perfil privado',
  },

  en: {
    // Login
    'login.title': 'Sign in',
    'login.password': 'Password',
    'login.error': 'Incorrect email or password',
    'login.loading': 'Signing in...',
    'login.submit': 'Sign in',
    'login.noAccount': "Don't have an account?",
    'login.signUp': 'Sign up',
    'login.forgotPassword': 'Forgot your password?',

    // Forgot password
    'forgot.title': 'Recover password',
    'forgot.subtitle':
      'Enter your email and we will generate a recovery token.',
    'forgot.submit': 'Generate token',
    'forgot.loading': 'Generating...',
    'forgot.error': 'Something went wrong. Please try again.',
    'forgot.emailSent': 'Check your email',
    'forgot.emailHint':
      'We sent you a link to reset your password. It expires in 6 hours.',
    'forgot.goToReset': 'Go to reset password →',
    'forgot.backToLogin': '← Back to login',

    // Reset password
    'reset.title': 'Reset password',
    'reset.subtitle': 'Enter your recovery token and your new password.',
    'reset.subtitleToken': 'Choose your new password.',
    'reset.tokenLabel': 'Recovery token',
    'reset.tokenPlaceholder': 'Paste your token here',
    'reset.passwordLabel': 'New password',
    'reset.confirmLabel': 'Confirm password',
    'reset.submit': 'Reset password',
    'reset.loading': 'Resetting...',
    'reset.mismatch': 'Passwords do not match.',
    'reset.error': 'Invalid or expired token.',
    'reset.success': 'Password updated! You can now sign in.',
    'reset.backToLogin': '← Back to login',

    // Register
    'register.title': 'Create account',
    'register.firstName': 'First name',
    'register.lastName': 'Last name',
    'register.firstNamePlaceholder': 'John',
    'register.lastNamePlaceholder': 'Doe',
    'register.emailPlaceholder': 'john@example.com',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm password',
    'register.required': 'Required',
    'register.minLength': 'At least 6 characters',
    'register.passwordMismatch': 'Passwords do not match',
    'register.submit': 'Create account',
    'register.loading': 'Creating account...',
    'register.error': 'Error creating account.',
    'register.hasAccount': 'Already have an account?',
    'register.signIn': 'Sign in',

    // Dashboard
    'dashboard.title': '🏆 World Cup Penca 2026',
    'dashboard.subtitle':
      'Predict matches, earn points and dominate the leaderboard.',
    'dashboard.tab.upcoming': 'Upcoming',
    'dashboard.tab.results': 'My Results',
    'dashboard.tab.ranking': 'Ranking',
    'upcoming.filterMissing': 'Missing prediction',
    'upcoming.filterActive': 'Showing only matches without a prediction',
    'upcoming.filterEmpty': 'All matches have a prediction 🎉',
    'filter.allStages': 'All phases',
    'filter.allGroups': 'All groups',
    'filter.group': 'Group',
    'filter.noMatches': 'No matches for the selected filters.',

    // MatchCard
    'match.group': 'Group',
    'match.stage.group_stage': 'Group Stage',
    'match.stage.round_of_32': 'Round of 32',
    'match.stage.round_of_16': 'Round of 16',
    'match.stage.quarter_final': 'Quarterfinal',
    'match.stage.semi_final': 'Semifinal',
    'match.stage.third_place': 'Third Place',
    'match.stage.final': 'Final',
    'match.saved': '✓ Prediction saved',
    'match.saving': 'Saving...',
    'match.update': 'Update prediction',
    'match.save': 'Save prediction',

    // PastMatchCard
    'past.myPrediction': 'Your prediction',
    'past.final': 'Final',
    'past.point': 'point',
    'past.points': 'points',
    'past.inProgress': 'In progress',
    'past.noPrediction': 'No prediction',
    'past.liveNotice': 'In play · score not final',
    'past.processingNotice': 'Processing result · may not be updated yet',

    // UserProfile
    'profile.back': '← Back',
    'profile.loading': 'Loading...',
    'profile.totalPoints': 'total pts',
    'profile.predictions': 'predictions',
    'profile.empty': 'has no predictions yet.',
    'profile.position': 'Rank',
    'profile.predictionOf': 'Prediction by',

    // Sidebar
    'sidebar.profile': '👤 My Profile',
    'sidebar.settings': '⚙️ Settings',
    'sidebar.logout': '🚪 Sign out',
    'sidebar.language': 'Language',
    'sidebar.switchTo': 'Español',
    'sidebar.langFlag': '🇺🇾',
    'sidebar.uploadPhoto': 'Change photo',
    'sidebar.removePhoto': 'Remove photo',
    'sidebar.uploading': 'Uploading...',

    // MatchHistory
    'history.empty':
      "😶 No results yet. Matches will appear here once they're finished!",
    'history.scoring.title': 'How are points calculated?',
    'history.scoring.exact.pts': '5 points',
    'history.scoring.exact.label': 'Exact result',
    'history.scoring.exact.desc':
      'You predicted the exact final score (e.g. you said 2-1 and it ended 2-1).',
    'history.scoring.diff.pts': '3 points',
    'history.scoring.diff.label': 'Correct goal difference',
    'history.scoring.diff.desc':
      'You got the goal difference right but not the exact score. Draws are included here: if you predicted a draw and the match ended in a draw, you get 3 points (e.g. you said 1-1 and it ended 0-0).',
    'history.scoring.winner.pts': '2 points',
    'history.scoring.winner.label': 'Correct winner',
    'history.scoring.winner.desc':
      'You predicted the right winning team, but not the goal difference or exact score. Does not apply to draws.',
    'history.scoring.zero.pts': '0 points',
    'history.scoring.zero.label': 'No match',
    'history.scoring.zero.desc':
      'The result was different from your prediction.',

    // Ranking
    'ranking.empty':
      '🏆 No participants in this ranking yet! Be the first to earn points.',
    'ranking.pos': 'Pos',
    'ranking.participant': 'Participant',
    'ranking.trend': 'Trend',
    'ranking.points': 'Points',
    'ranking.place': 'Rank',
    'ranking.pts': 'pts',
    'ranking.rising': '▲ Rising',
    'ranking.risingIcon': '▲',
    'ranking.falling': '▼ Falling',
    'ranking.fallingIcon': '▼',
    'ranking.steady': '= Holding',
    'ranking.steadyIcon': '-',
    'ranking.newGroup': '+ New group',
    'ranking.loading': 'Loading...',
    'ranking.loadingRanking': 'Loading ranking...',
    'ranking.noGroups.title': "You don't belong to any group yet",
    'ranking.noGroups.desc':
      'Create a group and invite your friends, family or colleagues to compare predictions.',
    'ranking.noGroups.cta': '+ Create my first group',
    'ranking.noParticipants':
      'This group has no participants yet. Invite your friends using ⚙️.',

    // Group panel
    'group.membersTitle': 'Members',
    'group.memberSingular': 'member',
    'group.memberPlural': 'members',
    'group.youLabel': '(you)',
    'group.roleAdmin': '👑 Admin',
    'group.roleMember': 'Member',
    'group.invite.title': 'Invite to group',
    'group.invite.generate': '🔗 Generate invite link',
    'group.invite.hint':
      'Share the link via WhatsApp, Telegram or any way you like',
    'group.invite.copy': 'Copy link',
    'group.invite.copied': '✓ Copied',
    'group.leave': 'Leave group',
    'group.delete': 'Delete group',
    'group.done': 'Done',
    'group.create.title': 'Create new group',
    'group.create.placeholder': 'E.g.: Family, Work, Friends...',
    'group.create.cancel': 'Cancel',
    'group.create.submit': 'Create group',
    'group.create.loading': 'Creating...',
    'group.manage': 'Manage group',
    'group.privateProfile': '🔒 Private profile',
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.es;
export { translations };
