const sqlAutomationRawQuery = 'SELECT a.id FROM automation as a '
  + `
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "slackAutomation"
        group by "automationId"
        ) as s
        on "s"."automationId"="a"."id"
        
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "emailAutomation"
        group by "automationId"
        ) as e
        on "e"."automationId"="a"."id"
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "freckleAutomation"
        group by "automationId"
        ) as f
        on "f"."automationId"="a"."id"
        where 1=1
      `;

export const queryCounter = 'SELECT COUNT(a.id) as count FROM automation as a '
  + `
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "slackAutomation"
        group by "automationId"
        ) as s
        on "s"."automationId"="a"."id"
        
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "emailAutomation"
        group by "automationId"
        ) as e
        on "e"."automationId"="a"."id"
        left join 
        (SELECT 
        "automationId", 
        SUM(
            (
                CASE 
                    WHEN status=? THEN 0
                    ELSE 1
                END
            )
        )
        as status
        
        from "freckleAutomation"
        group by "automationId"
        ) as f
        on "f"."automationId"="a"."id"
        where 1=1
      `;

export const totalAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
            left join 
            (
                SELECT "automationId" 
                from "slackAutomation"
                group by "automationId"
            ) as s
            on "s"."automationId"="a"."id"

            left join 
            (   
                SELECT "automationId"
                from "emailAutomation"
                group by "automationId"
            ) as e
            on "e"."automationId"="a"."id"

            left join 
            (
                SELECT "automationId"        
                from "freckleAutomation"
                group by "automationId"
            ) as f
            on "f"."automationId"="a"."id"
    ;
`;

export const totalSuccessAutomationQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
            left join 
            (SELECT 
            "automationId", 
            SUM(
                (
                    CASE 
                        WHEN status='success' THEN 0
                        ELSE 1
                    END
                )
            )
            as status
            
            from "slackAutomation"
            group by "automationId"
            ) as s
            on "s"."automationId"="a"."id"
            
            left join 
            (SELECT 
            "automationId", 
            SUM(
                (
                    CASE 
                        WHEN status='success' THEN 0
                        ELSE 1
                    END
                )
            )
            as status
            
            from "emailAutomation"
            group by "automationId"
            ) as e
            on "e"."automationId"="a"."id"
            left join 
            (SELECT 
            "automationId", 
            SUM(
                (
                    CASE 
                        WHEN status='success' THEN 0
                        ELSE 1
                    END
                )
            )
            as status
            
            from "freckleAutomation"
            group by "automationId"
            ) as f
            on "f"."automationId"="a"."id"
            where 1=1

            and s.status = 0
            and e.status = 0
            and f.status = 0
    ;
`;

export const totalOnboardingAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    left join 
    (
        SELECT "automationId"
        from "slackAutomation"
        group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"

    left join 
    (
        SELECT "automationId"
        from "emailAutomation"
        group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"

    left join 
    (
        SELECT "automationId"
        from "freckleAutomation"
        group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    where "a"."type"='onboarding'
    ;
`;

export const successOnboardingAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "slackAutomation"
    group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"

    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "emailAutomation"
    group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"
    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "freckleAutomation"
    group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    where 1=1

    and "a"."type"='onboarding'
    and s.status = 0
    and e.status = 0
    and f.status = 0
    ;
`;

export const totalOffboardingAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    left join 
    (
        SELECT "automationId"
        from "slackAutomation"
        group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"

    left join 
    (
        SELECT "automationId"
        from "emailAutomation"
        group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"

    left join 
    (
        SELECT "automationId"
        from "freckleAutomation"
        group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    where "a"."type"='offboarding'
    ;
`;

export const successOffboardingAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "slackAutomation"
    group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"

    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "emailAutomation"
    group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"
    left join 
    (SELECT 
    "automationId", 
    SUM(
        (
            CASE 
                WHEN status='success' THEN 0
                ELSE 1
            END
        )
    )
    as status

    from "freckleAutomation"
    group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    where 1=1

    and "a"."type"='offboarding'
    and s.status = 0
    and e.status = 0
    and f.status = 0
    ;
`;

export const totalSlackAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId"
        from "slackAutomation"
        group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"
;
`;

export const successSlackAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId",

        SUM(
            (
                CASE 
                    WHEN status='success' THEN 0
                    ELSE 1
                END
            )
        ) as status

        from "slackAutomation"
        group by "automationId"
    ) as s
    on "s"."automationId"="a"."id"
    WHERE 1=1
    and s.status = 0
;
`;

export const totalFreckleAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId"
        from "freckleAutomation"
        group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
;
`;

export const successFreckleAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId",

        SUM(
            (
                CASE 
                    WHEN status='success' THEN 0
                    ELSE 1
                END
            )
        ) as status

        from "freckleAutomation"
        group by "automationId"
    ) as f
    on "f"."automationId"="a"."id"
    WHERE 1=1
    and f.status = 0
;
`;

export const totalEmailAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId"
        from "emailAutomation"
        group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"
;
`;

export const successEmailAutomationsQuery = `
    SELECT COUNT(a.id) as count FROM automation as a 
    INNER join 
    (
        SELECT "automationId",

        SUM(
            (
                CASE 
                    WHEN status='success' THEN 0
                    ELSE 1
                END
            )
        ) as status

        from "emailAutomation"
        group by "automationId"
    ) as e
    on "e"."automationId"="a"."id"
    WHERE 1=1
    and e.status = 0
;
`;

export default sqlAutomationRawQuery;
