<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Calendrier;
use AppBundle\Entity\Stagiaire;
use AppBundle\Entity\StagiaireParEntreprise;
use AppBundle\Filtre\StagiaireParEntrepriseFiltre;
use AppBundle\Form\Filtre\StagiaireParEntrepriseFiltreType;
use AppBundle\Repository\CalendrierRepository;
use AppBundle\Repository\StagiaireParEntrepriseRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * StagiaireParEntreprisecontroller.
 *
 * @Route("stagiaires")
 */
class StagiaireParEntrepriseController extends Controller
{
    /**
     * Lists all stagiaireParEntreprise entities.
     *
     * @Route("/", name="stagiaires_index")
     * @Method({"GET", "POST"})
     */
    public function indexAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $repo = $this->getDoctrine()->getRepository(StagiaireParEntreprise::class);

        //Création de l'objet filtre
        $filtre = new  StagiaireParEntrepriseFiltre();

        //Création du formulaire de recherche
        $form = $this->createForm(StagiaireParEntrepriseFiltreType::class, $filtre, array(
            'attr' => array('id' => 'stagiaire_search'),
            'action' => $this->generateUrl('stagiaires_index'),
            'method' => 'POST'
        ));

        $stagiairesEntreprise = null;

        // Le formulaire écoute les requêtes (pour le submit)
        $form->handleRequest($request);


        //Si le formulaire est sousmis
        if ($form->isSubmitted()) {
            //Réponse à la recherche
            $stagiairesEntreprise = $repo->search($filtre);

            return $this->render(':stagiaire:tableStagiaire.html.twig', array(
                'stagiairesEntreprise' => $stagiairesEntreprise,
            ));
        } else {
            $stagiairesEntreprise = $repo->search();

            return $this->render('stagiaire/index.html.twig', array(
                'stagiairesEntreprise' => $stagiairesEntreprise,
                'formSearch' => $form->createView()
            ));
        }
    }

    /**
     * Finds and displays a stagiaire entity.
     *
     * @Route("/show/{numLien}", name="stagiaires_show")
     * @Method("GET")
     */
    public function showAction(StagiaireParEntreprise $stagiaireParEntreprise)
    {

        // Affichage de la fiche du stagiaire avec la liste de ses calendrier
        $repo = $this->getDoctrine()->getRepository(Calendrier::class);

        // TODO : Modifier les appels en base pour retourner les calendriers du stagiaire et créer des tableaux.
        $calendrierNonInscrit = $repo->findBy(array('stagiaire' => $stagiaireParEntreprise->getStagiaire(), 'isInscrit' => 0));
        $calendrierInscrit = $repo->findOneBy(array('stagiaire' => $stagiaireParEntreprise->getStagiaire(), 'isInscrit' => 1));

        // On retourne les données de l'objet stagiaireParEntreprise et des calendriers du stagiaire
        return $this->render('stagiaire/show.html.twig', array(
            'stagiaireParEntreprise' => $stagiaireParEntreprise,
            'calendars' => $calendrierNonInscrit,
            'calendarRegistered' => $calendrierInscrit,
        ));
    }

    /**
     * Finds and display all entities
     *
     * @Route("/all", options = { "expose" = true }, name="all_Stagiaires")
     *
     * @Method("GET")
     */
    public function StagiairesAction(Request $request)
    {
        if (!$request->isXmlHttpRequest()) {//check if request is AJAX request, if not redirect
            return $this->redirectToRoute(
                'stagiaires_index'//changed this, of course
            );
        }
        $repo = $this->getDoctrine()->getRepository(StagiaireParEntreprise::class);
        $stagiaires = $repo->findAll();
        return new JsonResponse($stagiaires);
    }




}