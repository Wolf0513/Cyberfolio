<?php
// API Have I Been Pawned 
 

$alerte_hibp = '';
$mot_de_passe_a_verifier = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['check_password'])) {
    
    // Récupère le mot de passe soumis
    $mot_de_passe_a_verifier = $_POST['password'] ?? '';
    
    if (!empty($mot_de_passe_a_verifier)) {
        
        // 1. Calculer le hachage SHA-1 du mot de passe (en majuscules)
        $hachage_sha1 = strtoupper(sha1($mot_de_passe_a_verifier));

        // 2. Extraire le préfixe (les 5 premiers caractères) et le suffixe
        $prefixe = substr($hachage_sha1, 0, 5);
        $suffixe = substr($hachage_sha1, 5);
        
        // 3. Préparer l'appel à l'API RANGE
        $url_api = "https://api.pwnedpasswords.com/range/{$prefixe}";
        
        $options_requete = [
            'http' => [
                'method' => 'GET',
                'header' => "User-Agent: CyberFolio-VerificateurMdp-v1\r\n"
            ]
        ];
        
        $contexte  = stream_context_create($options_requete);
        $reponse = @file_get_contents($url_api, false, $contexte);
        
        $est_compromis = false;
        
        if ($reponse !== false) {
            // 4. Analyser la réponse et chercher le suffixe
            $lignes = explode("\n", $reponse);
            
            foreach ($lignes as $ligne) {
                if (str_starts_with($ligne, $suffixe)) { 
                    
                    $compte_apparition = (int)trim(substr($ligne, strpos($ligne, ':') + 1));
                    
                    if ($compte_apparition > 0) {
                        $est_compromis = true;
                        $alerte_hibp = "<div class='compromis'>
                            ❌ <strong> DANGER ! </strong> Ce mot de passe a été trouvé <strong>{$compte_apparition}</strong> fois dans des fuites de données.
                            <p>Changez-le immédiatement !</p>
                        </div>";
                        break;
                    }
                }
            }
        }
        
        if (!$est_compromis) {
             $alerte_hibp = "<div class='securise'>
                 ✅ <strong> SÉCURISÉ ! </strong> Ce mot de passe n'a pas été trouvé dans les fuites.
            </div>";
        }

    } else {
        $alerte_hibp = "<div class='information'>
            ⚠️ <strong> Erreur de saisie</strong> : Veuillez entrer un mot de passe.
        </div>";
    }
}