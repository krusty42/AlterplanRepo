<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User;

/**
 * Utilisateur
 *
 * @ORM\Table(name="Utilisateur")
 * @ORM\Entity
 */
class Utilisateur extends User
{
    const ROLE_ADMIN = 'ROLE_ADMIN';
    /**
     * @var int
     *
     * @ORM\Column(name="CodeUtilisateur", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $codeUtilisateur;

    /**
     * @var string
     *
     * @ORM\Column(name="Nom", type="string", length=100, nullable=true)
     */
    private $nom;

    /**
     * @var string
     *
     * @ORM\Column(name="Prenom", type="string", length=100, nullable=true)
     */
    private $prenom;

    /**
     * @var bool
     *
     * @ORM\Column(name="IsAdministrateur", nullable=false)
     */
    private $isAdministrateur;

    function __construct()
    {
        parent::setEnabled(true);
        parent::setRoles(array('ROLE_USER'));
        $this->setIsAdministrateur(true);
    }

    /**
     * @return int
     */
    public function getCodeUtilisateur()
    {
        return $this->codeUtilisateur;
    }

    /**
     * @param int $codeUtilisateur
     * @return Utilisateur
     */
    public function setCodeUtilisateur($codeUtilisateur)
    {
        $this->codeUtilisateur = $codeUtilisateur;
        return $this;
    }

    /**
     * @return string
     */
    public function getNom()
    {
        return $this->nom;
    }

    /**
     * @param string $nom
     * @return Utilisateur
     */
    public function setNom($nom)
    {
        $this->nom = $nom;
        return $this;
    }

    /**
     * @return string
     */
    public function getPrenom()
    {
        return $this->prenom;
    }

    /**
     * @param string $prenom
     * @return Utilisateur
     */
    public function setPrenom($prenom)
    {
        $this->prenom = $prenom;
        return $this;
    }

    /**
     * @return string
     */
    public function getEmail()
    {
        return parent::getEmail();
    }

    /**
     * @param string $email
     * @return Utilisateur
     */
    public function setEmail($email)
    {
        parent::setEmail($email);
        parent::setEmailCanonical($email);
        return $this;
    }

    /**
     * @return bool
     */
    public function getIsAdministrateur()
    {
        return $this->isAdministrateur;
    }

    /**
     * @param bool $isAdministrateur
     * @return Utilisateur
     */
    public function setIsAdministrateur($isAdministrateur)
    {
        $this->isAdministrateur = (bool)$isAdministrateur;
        if ($isAdministrateur){
            parent::addRole('ROLE_ADMIN');
        }else{
            parent::removeRole('ROLE_ADMIN');
        }
        return $this;
    }

    /**
     * @return string
     */
    public function getPassword()
    {
        return parent::getPassword();
    }

    /**
     * @param string $password
     * @return Utilisateur
     */
    public function setPassword($password)
    {
        parent::setPassword($password);
        return $this;
    }

    /**
     * @return string
     */
    public function getUsername()
    {
        return parent::getUsername();
    }

    /**
     * @param string $username
     * @return Utilisateur
     */
    public function setUsername($username)
    {
        parent::setUsername($username);
        return $this;
    }
}
