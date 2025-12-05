import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Random;

public class PixelandGame {

    // Le conteneur principal qui va changer d'écran (CardLayout)
    private static JPanel mainContainer;
    private static CardLayout cardLayout;

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Pixeland vs BigTechos - Nuit de l'Info");
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setSize(800, 600);
            frame.setLocationRelativeTo(null); // Centrer

            // Configuration du gestionnaire d'écrans
            cardLayout = new CardLayout();
            mainContainer = new JPanel(cardLayout);

            // --- CRÉATION DES ÉCRANS ---
            
            // 1. Menu Principal
            JPanel menuPanel = createMenuPanel();
            
            // 2. Niveau 1 : Le Clicker
            JPanel level1Panel = new Level1Clicker();
            
            // 3. Niveau 2 : L'Assemblage
            JPanel level2Panel = new Level2Assembler();
            
            // 4. Niveau 3 : La Défense
            JPanel level3Panel = new Level3Defense();

            // 5. Écran de Victoire
            JPanel victoryPanel = createVictoryPanel();

            // Ajout des écrans au conteneur "cartes"
            mainContainer.add(menuPanel, "MENU");
            mainContainer.add(level1Panel, "LEVEL1");
            mainContainer.add(level2Panel, "LEVEL2");
            mainContainer.add(level3Panel, "LEVEL3");
            mainContainer.add(victoryPanel, "VICTOIRE");

            frame.add(mainContainer);
            frame.setVisible(true);
        });
    }

    // --- NAVIGATION ---
    public static void showScreen(String name) {
        cardLayout.show(mainContainer, name);
    }

    // --- ÉCRAN : MENU ---
    private static JPanel createMenuPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBackground(Color.BLACK);
        
        JLabel title = new JLabel("PIXELAND VS BIGTECHOS");
        title.setForeground(Color.GREEN);
        title.setFont(new Font("Courier", Font.BOLD, 30));
        
        JButton startBtn = new JButton("COMMENCER LA MISSION");
        styleButton(startBtn);
        
        startBtn.addActionListener(e -> showScreen("LEVEL1"));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0; gbc.gridy = 0; gbc.insets = new Insets(20,0,20,0);
        p.add(title, gbc);
        gbc.gridy = 1;
        p.add(startBtn, gbc);
        
        return p;
    }

    // --- ÉCRAN : VICTOIRE ---
    private static JPanel createVictoryPanel() {
        JPanel p = new JPanel(new GridBagLayout());
        p.setBackground(new Color(0, 50, 0)); // Vert foncé
        
        JLabel msg = new JLabel("VICTOIRE ! LE VILLAGE EST SAUVÉ !");
        msg.setForeground(Color.WHITE);
        msg.setFont(new Font("Arial", Font.BOLD, 25));
        
        // Bonus Decathlon
        JButton linkBtn = new JButton("S'équiper chez Décathlon (Bonus)");
        styleButton(linkBtn);
        linkBtn.setBackground(Color.WHITE);
        linkBtn.setForeground(Color.BLUE);
        
        linkBtn.addActionListener(e -> {
            try {
                Desktop.getDesktop().browse(new java.net.URI("https://www.decathlon.fr"));
            } catch (Exception ex) { ex.printStackTrace(); }
        });

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0; gbc.gridy = 0; gbc.insets = new Insets(20,0,20,0);
        p.add(msg, gbc);
        gbc.gridy = 1;
        p.add(linkBtn, gbc);

        return p;
    }

    // Utilitaire de style pour faire "Hacker"
    private static void styleButton(JButton btn) {
        btn.setBackground(Color.GREEN);
        btn.setForeground(Color.BLACK);
        btn.setFont(new Font("Courier", Font.BOLD, 16));
        btn.setFocusPainted(false);
        btn.setBorder(BorderFactory.createLineBorder(Color.WHITE, 2));
    }

    // ==========================================
    // MINI-JEU 1 : CLICKER (RÉCUPÉRATION)
    // ==========================================
    static class Level1Clicker extends JPanel {
        private int score = 0;
        private final int OBJECTIF = 10;
        private JLabel scoreLabel;

        public Level1Clicker() {
            setLayout(new BorderLayout());
            setBackground(Color.DARK_GRAY);

            // En-tête
            JLabel consigne = new JLabel("NIVEAU 1 : Clique vite pour récupérer 10 composants !", SwingConstants.CENTER);
            consigne.setForeground(Color.WHITE);
            consigne.setFont(new Font("Arial", Font.BOLD, 18));
            add(consigne, BorderLayout.NORTH);

            // Zone centrale (Gros bouton poubelle)
            JButton trashBtn = new JButton("ZONE DE DÉCHETS (CLIQUE MOI !)");
            trashBtn.setFont(new Font("Impact", Font.PLAIN, 24));
            trashBtn.setBackground(Color.GRAY);
            trashBtn.setForeground(Color.WHITE);

            // Logique du jeu
            trashBtn.addActionListener(e -> {
                score++;
                scoreLabel.setText("Composants récupérés : " + score + " / " + OBJECTIF);
                
                // Effet visuel simple
                trashBtn.setBackground(score % 2 == 0 ? Color.GRAY : Color.LIGHT_GRAY);

                if (score >= OBJECTIF) {
                    JOptionPane.showMessageDialog(this, "Bravo ! Matériel récupéré.");
                    showScreen("LEVEL2"); // Passage au niveau suivant
                }
            });

            add(trashBtn, BorderLayout.CENTER);

            // Score en bas
            scoreLabel = new JLabel("Composants récupérés : 0 / " + OBJECTIF, SwingConstants.CENTER);
            scoreLabel.setForeground(Color.YELLOW);
            scoreLabel.setFont(new Font("Courier", Font.BOLD, 20));
            add(scoreLabel, BorderLayout.SOUTH);
        }
    }

    // ==========================================
    // MINI-JEU 2 : ASSEMBLAGE (PUZZLE SIMPLE)
    // ==========================================
    static class Level2Assembler extends JPanel {
        private int partsInstalled = 0;
        private final String[] components = {
            "Carte Mère", "Processeur (CPU)", "RAM", 
            "Disque Dur", "Carte Graphique", "Alimentation"
        };
        private JLabel statusLabel;

        public Level2Assembler() {
            setLayout(new BorderLayout());
            setBackground(new Color(30, 30, 30));

            JLabel title = new JLabel("NIVEAU 2 : Assemble le PixelPC V1", SwingConstants.CENTER);
            title.setForeground(Color.WHITE);
            title.setFont(new Font("Arial", Font.BOLD, 18));
            add(title, BorderLayout.NORTH);

            // Grille de boutons
            JPanel grid = new JPanel(new GridLayout(2, 3, 10, 10));
            grid.setBackground(new Color(30, 30, 30));
            grid.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

            for (String compName : components) {
                JButton btn = new JButton(compName);
                styleButton(btn);
                btn.setBackground(Color.RED); // Rouge = Pas installé
                btn.setForeground(Color.WHITE);

                btn.addActionListener(e -> {
                    // Quand on clique, on "installe" le composant
                    btn.setEnabled(false); // On ne peut plus cliquer
                    btn.setBackground(Color.GREEN); // Il devient vert
                    btn.setText(compName + " [OK]");
                    
                    partsInstalled++;
                    statusLabel.setText("Assemblage : " + partsInstalled + " / " + components.length);

                    if (partsInstalled == components.length) {
                        JOptionPane.showMessageDialog(this, "PC Assemblé ! Lancement du système...");
                        // Important : On doit lancer le timer du niveau 3 quand on y arrive
                        Level3Defense.startGame(); 
                        showScreen("LEVEL3");
                    }
                });
                grid.add(btn);
            }

            add(grid, BorderLayout.CENTER);

            statusLabel = new JLabel("Assemblage : 0 / " + components.length, SwingConstants.CENTER);
            statusLabel.setForeground(Color.YELLOW);
            statusLabel.setFont(new Font("Courier", Font.BOLD, 20));
            add(statusLabel, BorderLayout.SOUTH);
        }
    }

    // ==========================================
    // MINI-JEU 3 : DÉFENSE (APPARITION ALÉATOIRE)
    // ==========================================
    static class Level3Defense extends JPanel {
        private static Timer spawnTimer;
        private static int adsClosed = 0;
        private static final int GOAL = 10;
        private static JLabel infoLabel;
        private static JPanel gameArea; // Zone où les pubs apparaissent

        public Level3Defense() {
            setLayout(new BorderLayout());
            setBackground(Color.BLACK);

            JLabel title = new JLabel("NIVEAU 3 : ALERTE VIRUS ! Ferme les fenêtres !", SwingConstants.CENTER);
            title.setForeground(Color.RED);
            title.setFont(new Font("Arial", Font.BOLD, 18));
            add(title, BorderLayout.NORTH);

            // Zone de jeu (Layout null pour positionnement absolu aléatoire)
            gameArea = new JPanel(null); 
            gameArea.setBackground(new Color(10, 10, 10));
            add(gameArea, BorderLayout.CENTER);

            infoLabel = new JLabel("Menaces stoppées : 0 / " + GOAL, SwingConstants.CENTER);
            infoLabel.setForeground(Color.GREEN);
            add(infoLabel, BorderLayout.SOUTH);
        }

        // Méthode statique pour démarrer le jeu quand on arrive sur cet écran
        public static void startGame() {
            adsClosed = 0;
            
            // Timer qui crée une pub toutes les 800ms
            spawnTimer = new Timer(800, new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    spawnAd();
                }
            });
            spawnTimer.start();
        }

        private static void spawnAd() {
            Random rand = new Random();
            
            // Création du bouton Pub
            JButton ad = new JButton("PUB GAFAM !");
            ad.setBackground(Color.RED);
            ad.setForeground(Color.WHITE);
            ad.setMargin(new Insets(0,0,0,0));
            ad.setFont(new Font("Arial", Font.BOLD, 10));
            
            // Taille et position aléatoire
            int w = 120;
            int h = 60;
            int x = rand.nextInt(gameArea.getWidth() - w);
            int y = rand.nextInt(gameArea.getHeight() - h);
            
            ad.setBounds(x, y, w, h);

            // Action au clic : fermer la pub
            ad.addActionListener(e -> {
                gameArea.remove(ad); // Supprimer le bouton
                gameArea.repaint();  // Rafraîchir l'écran
                
                adsClosed++;
                infoLabel.setText("Menaces stoppées : " + adsClosed + " / " + GOAL);

                if (adsClosed >= GOAL) {
                    spawnTimer.stop();
                    JOptionPane.showMessageDialog(gameArea, "Système sécurisé !");
                    PixelandGame.showScreen("VICTOIRE");
                }
            });

            gameArea.add(ad);
            gameArea.repaint();
        }
    }
}